package pashion

import groovyx.net.http.FromServer
import groovyx.net.http.ApacheHttpBuilder
import grails.transaction.Transactional
import reactor.spring.context.annotation.*

@Transactional
@Consumer
class StuartService {

    static scope = "singleton"
    def uri =  'https://sandbox-api.stuart.com'

    def clientID = "a9a96844e2a2e78208b3327d03ac105f6cdf842d404cec8006c12e7969104630"
	def secret = "60d76bb547879450f03927dc501f5c2ef8d00c2188c684bc955fb06edde1f0c3"
	def token = null
     
    
    
	def newToken(){
		def newToken = null
		KeyValue.withTransaction { status ->
			def current = KeyValue.findByItemKey("stuart")
			if(current == null)
				current = new KeyValue(itemKey:'stuart')
		
			def http = ApacheHttpBuilder.configure {
		    	request.uri = uri
			}
			newToken = http.post {
	    		request.uri.path = '/oauth/token'
	    		request.contentType = 'application/x-www-form-urlencoded'
	    		request.body = [client_id:clientID,client_secret:secret,scope:'api',grant_type:'client_credentials']
	    		response.success { FromServer from, Object body ->
	        		return body.access_token
	    		}
			}
			log.info "response:"+ newToken

			current.itemValue = token
			current.save(failOnError: true, flush:true)
		}
		token = newToken
		newToken
	}

	// Recommended that we do not use this, just do a Job Quote
	def createLocation(Address address, String placeTypeId){
		if(token == null)
			token = KeyValue.findByItemKey("stuart")?.itemValue
		if(token == null)
			newToken()

		def addressStreet = address.address1 + " " + address.postalCode + " " + address.city

		def newLocation = null
	
		def http = ApacheHttpBuilder.configure {
	    	request.uri = uri
		}
		newLocation = http.post {
			request.headers['Authorization'] = 'Bearer ' + token
    		request.uri.path = '/v1/places'
    		request.contentType = 'application/x-www-form-urlencoded'
    		request.body = [placeTypeId:placeTypeId,
    						addressStreet:addressStreet,
    						contactCompany:address.company,
    						comment:address.comment,
    						contactPhone:address.contactPhone,
    						addressPostCode:address.postalCode]
    		response.success { FromServer from, Object body ->
    			log.info "Create Location id:"+body.id
    			log.info "body:"+body
        		return body.id
    		}
		}
		newLocation
	}

	/*
		Transport Type IDs (available in Paris and London)
		2	Bike	Maximum capacity of 80L (60cm x 40cm x 26cm) and 12kg
		3	Motorbike	Maximum capacity of 80L (60cm x 40cm x 26cm) and 15kg
		4	Car	Maximum capacity of 200L (50cm x 80cm x 50cm) and 50kg
		5	Cargo Bike	Electric engine-supported cargo-bikes with maximum capacity of 140L (46cm x 47cm x 68cm) and 50kg
		
		https://docs.stuart.com/#/reference/job-quotes/create-a-job-quote

	*/
	def createJobQuote(Address fromAddress, Address toAddress,
					 ShippingEvent shippingEvent, String transport){
		if(transport == 'Car')
			transport = '4'
		if(transport == 'Bike')
			transport = '2'
		if(transport == 'Scooter')
			transport = '3'

		if(token == null)
			token = KeyValue.findByItemKey("stuart")?.itemValue
		if(token == null)
			newToken()
		def http = ApacheHttpBuilder.configure {
	    	request.uri = uri
		}
		def nameArray = toAddress.attention.split()
		def firstName = nameArray[0]
		def lastName = ""
		if(nameArray.size() >1)
			lastName = nameArray[1]

		def destination = toAddress.address1 + " " + toAddress.postalCode + " " + toAddress.city
		def origin = fromAddress.address1 + " " + fromAddress.postalCode + " " + fromAddress.city
		def quote = http.post {
			request.headers['Authorization'] = 'Bearer ' + token
    		request.uri.path = '/v1/jobs/quotes/types'
    		request.contentType = 'application/x-www-form-urlencoded'
    		request.body = [transportTypeIds:transport,
					destination:destination,
					destinationContactCompany:toAddress.company,
					destinationContactFirstname:firstName,
					destinationContactLastname:lastName,
					destinationContactPhone:toAddress.contactPhone,
					origin:origin,
					originContactPhone:fromAddress.contactPhone]
    		response.success { FromServer from, Object body ->
    			log.info "body:"+body[transport]
        		return body[transport]
    		}
		}
		log.info "quote id:"+quote.id
		log.info "distance :"+quote.distance
		log.info "duration :"+quote.duration
		shippingEvent.stuartQuoteId = quote.id
		shippingEvent.save(failOnError:true,flush:true)
	}

	
	def createJob(Address fromAddress, Address toAddress, ShippingEvent shippingEvent){

		if(token == null)
			token = KeyValue.findByItemKey("stuart")?.itemValue
		if(token == null)
			newToken()
		def http = ApacheHttpBuilder.configure {
	    	request.uri = uri
		}

		def job
		def message
		def pickupAt = shippingEvent.sampleRequest.pickupDate.format("yyyy-MM-dd'T'HH:mm:ss'Z'", TimeZone.getTimeZone("UTC"))
		def jobQuoteId = shippingEvent.stuartQuoteId
		log.info "pickup at:"+pickupAt
		log.info "quote id:"+jobQuoteId

		http.post {
			request.headers['Authorization'] = 'Bearer ' + token
    		request.uri.path = '/v1/jobs'
    		request.contentType = 'application/x-www-form-urlencoded'
    		request.body = [
    						jobQuoteId:jobQuoteId,
    						clientReference:shippingEvent.id,
    						destinationComment:toAddress.comment,
    						originComment:fromAddress.comment,
    						pickupAt:pickupAt 
    						]
    		response.failure { FromServer from, Object body ->
    			log.error "failure error:"+body.errors[0].key
    			message = body.errors[0].key
    		}
    		response.success { FromServer from, Object body ->
        		job = body
    		}
		}
		if(job){
			log.info "job status:"+job.status
			shippingEvent.stuartJobId = job.id
			shippingEvent.stuartStatus = job.status
			shippingEvent.status = job.status
			shippingEvent.currency = job.currency.isoCode
			shippingEvent.finalAmount =  new BigDecimal(job.finalJobPrice.finalTotalAmount)
			shippingEvent.save(failOnError:true,flush:true)

			return shippingEvent
		} else{
			return message
		}
	}


	@Selector('shippingOut')
    void shippingOut(Object sr){
    	Address address1 = sr.returnToAddress
        Address address2 =  sr.addressDestination
        def shippingEvent = createJobQuote(address1,address2,sr.shippingOut,sr.courierOut)
        def response = createJob(address1,address2,shippingEvent)
    }

}