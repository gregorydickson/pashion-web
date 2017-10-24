package pashion

import static org.springframework.http.HttpStatus.*
import grails.transaction.Transactional
import java.text.SimpleDateFormat
import grails.converters.JSON
import groovy.time.*
import java.util.TimeZone


@Transactional(readOnly = true)
class StuartController {

	def stuartService
	def sampleRequestService



	/*
		Webhook update data:

		  "event": "job", // Can also be "driver" but it could be anything in a near future
		  "type": "update", // Can also be "create"
		  "data": {
		    "id": 1,
		    "currentDelivery": {
		      "id": 1,
		      "driver": {
		        "status": "busy",
		        "latitude": "72.95559451",
		        "longitude": "-155.95014084",
		        "name": "Fabien Foobar",
		        "firstname": "Fabien",
		        "lastname": "Foobar",
		        "phone": "+33100000000",
		        "transportType": {"code": "motorbike"}
		      },
		      "status": "delivered" // Can be cancelled delivered delivering almost_delivering picking almost_picking
		    },
		    "transportType": {
		      "code": "walk" // Can be walk bike motorbike cargobike car
		    },
		    "status": "finished" // Can be expired canceled finished in_progress accepted new
		  }
	*/
	def update(){
		if(request.JSON){
			
			def update = request.JSON
			log.info "STUART UPDATE "+update
			try{
				ShippingEvent.withTransaction{

					ShippingEvent shippingEvent = ShippingEvent.get(update.data.job.jobReference.toInteger())
					if(shippingEvent){
						shippingEvent.lock()
						shippingEvent.status = update.data.status.capitalize()
						shippingEvent.stuartStatus = update.data.status
						
						DateFormat df1 = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
						
						shippingEvent.etaToDestination = df1.parse(update.data.job.currentDelivery.etaToDestination)
						shippingEvent.etaToOrigin = df1.parse(update.data.job.currentDelivery.etaToOrigin)

						shippingEvent.transportType = update.data.job.currentDelivery.driver.transportType.code
						shippingEvent.driverStatus = update.data.job.currentDelivery.driver.status
						if(update.data.job.currentDelivery.driver.status == "picking" && shippingEvent.pickedUpAt == null)
							shippingEvent.pickedUpAt = new Date()
						if(update.data.job.currentDelivery.driver.status == "delivered" && shippingEvent.deliveredAt == null)
							shippingEvent.deliveredAt = new Date()
						if(update.data.job.currentDelivery.driver.status == "almost_picking" && (!shippingEvent.pickArrivalNotification)){
							notify "shippingEventAlmostPicking",[shippingEventId:shippingEvent.id]
							shippingEvent.pickArrivalNotification = true
						}
						shippingEvent.latitude = new BigDecimal(update.data.job.currentDelivery.driver.latitude)
						shippingEvent.longitude = new BigDecimal(update.data.job.currentDelivery.driver.longitude)
						shippingEvent.driverPhone = update.data.job.currentDelivery.driver.phone
						shippingEvent.driverName = update.data.job.currentDelivery.driver.firstname + " " + update.data.job.currentDelivery.driver.lastname
						shippingEvent.save(failOnError:true,flush:true)
						log.info "stuart webhook update complete for booking:"+shippingEvent?.sampleRequest?.id
					}
				}
			} catch (Exception e){
				log.error "Exception with Stuart Webhook update",e
				log.error e.printStackTrace()
			}
		}
		response.status = 200
		render([status: 'updated'] as JSON)

	}

	def bookOut(){
		def message
        def sr = sampleRequestService.updateSampleRequest(request.JSON)


        message = checkRules(sr,'bookOut')
        if(message){
        	response.status = 200
        	render message 
        	return
        }
        //check to see if there is an origin/returnTo address
        def returnTo = sr.returnToAddress
        if(sr.pressHouse && sr.brand && (sr.returnToAddress == null)){
        	def brandAddress = Address.findByBrandAndDefaultAddress(sr.brand,true)
        	log.info "Brand address:"+brandAddress?.name

        	if(brandAddress) returnTo = brandAddress
        }
        
        def shippingEvent = sr?.shippingOut
        log.info "origin:"+returnTo?.address1 
        log.info "destination:"+sr?.addressDestination?.address1
        shippingEvent = stuartService.createJobQuote(returnTo,sr.addressDestination,shippingEvent,"Scooter")
        log.info "quote:"+shippingEvent
        if(shippingEvent instanceof Map){
        	log.error "quote ERROR 1 : " + shippingEvent
        	message = stuartMessage(shippingEvent)
        	message = [message:message]
        	render message as JSON
        	return
        }

        Date theDate
        def theTime
        use (TimeCategory) {
        	theDate = sr.pickupDate.clearTime()
        	theTime = sr.pickupTime.split(":")
        	theDate = theDate + theTime[0].toInteger().hours
        	theDate = theDate + theTime[1].toInteger().minutes
        }

		shippingEvent = stuartService.createJob(theDate,returnTo,sr.addressDestination,shippingEvent)
        if(shippingEvent instanceof Map){
        	log.error "stuart error message:"+shippingEvent.message
        	message = [message:stuartMessage(shippingEvent)]
        }else{
        	message = [message:"Messenger Booked"]
        	response.status = 200
        }
        render message as JSON
	}

	def bookReturn(){
		def message
		def sr = sampleRequestService.updateSampleRequest(request.JSON)
		log.info "about to check rules"
		message = checkRules(sr,'bookReturn')
        if(message){
        	log.info "message:"+message
        	response.status = 200
        	render message 
        	return
        }

        //check to see if there is an origin/returnTo address
        def returnTo = sr.returnToAddress
        if(sr.pressHouse && sr.brand && (sr.returnToAddress == null)){
        	def brandAddress = Address.findByBrandAndDefaultAddress(sr.brand,true)
        	log.info "Brand address:"+brandAddress.name

        	if(brandAddress) returnTo = brandAddress
        }

        def shippingEvent = sr.shippingReturn
        shippingEvent = stuartService.createJobQuote(sr.addressDestination,
        								returnTo,shippingEvent,"Scooter")
        log.info "quote:"+shippingEvent
        if(shippingEvent instanceof Map){
        	log.error "quote ERROR 2"
        	message = stuartMessage(shippingEvent)
        	message = [message:message]
        	render message as JSON
        	return
        }

        Date theDate
        def theTime
        use (TimeCategory) {
        	theDate = sr.pickupDateReturn.clearTime()
        	theTime = sr.pickupTimeReturn.split(":")
        	theDate = theDate + theTime[0].toInteger().hours
        	theDate = theDate + theTime[1].toInteger().minutes
        }
        
		shippingEvent = stuartService.createJob(theDate,sr.addressDestination,returnTo,shippingEvent)
        if(shippingEvent instanceof Map){
        	log.error "quote ERROR 3"
        	message = stuartMessage(shippingEvent)
        	message = [message:message]

        }else{
        	message = [message:"Messenger Booked"]
        	response.status = 200
        }
        render message as JSON
	}



	def checkRules(SampleRequest sr,String direction){
		log.info "check rules for stuart"
		def message

		//must be approved
		if(sr.requestStatusBrand == 'Pending' ||
			sr.requestStatusBrand == 'Denied' ||
			sr.requestStatusBrand == 'Deleted'){

			message = [message:"Request must be Approved"] as JSON
        	
        	return message
		}


		TimeZone.setDefault(TimeZone.getTimeZone("Europe/London"))
		

		//no booking in the past
		Date now = new Date()
		log.info "stuart check rules now:"+now
		Date timebuffer
		use(TimeCategory) {
        	timebuffer = now + 30.minutes 
        }
        log.info "stuart check rules buffer:"+timebuffer
        if(direction == 'bookOut'){
        	Date theDate
	        def theTime
	        use (TimeCategory) {
	        	theDate = sr.pickupDate.clearTime()
	        	theTime = sr.pickupTime.split(":")
	        	theDate = theDate + theTime[0].toInteger().hours
	        	theDate = theDate + theTime[1].toInteger().minutes
	        }
	        if(theDate < timebuffer){
	        	message = [message:"Cannot book messenger in the past or less than 30 minutes"] as JSON
        	
        		return message
	        }
        }

        if(direction == 'bookReturn'){
        	log.info "book return"
        	Date theDate
	        def theTime
	        use (TimeCategory) {
	        	theDate = sr.pickupDateReturn.clearTime()
	        	theTime = sr.pickupTimeReturn.split(":")
	        	theDate = theDate + theTime[0].toInteger().hours
	        	theDate = theDate + theTime[1].toInteger().minutes
	        }
	        log.info "booking date:"+theDate
	        log.info "buffer:"+timebuffer
	        if(theDate < timebuffer){
	        	message = [message:"Cannot book messenger in the past"] as JSON
        	
        		return message
	        }
        }
        
		//must be different locations
		if(sr.addressDestination == sr.returnToAddress){
        	message = [message:"Origin and Destination are the same"] as JSON
        	return message
        }
        return null
	}


	def stuartMessage(response){
		log.info "response:"+response
		def result
		def message 
		if(response.message)
			message = response.message
		else if(response.error)
			message = response.error

		switch (message) {
	        case 'JOB_DELIVERIES_INVALID':
	            //that the delivery is invalid
	            log.error "JOB_DELIVERIES_INVALID"
	            result = "JOB_DELIVERIES_INVALID"
	            return result
	            break
	        case 'JOB_PICKUP_AT_INVALID':
	        	log.error "Job PICKUP AT Invalid"
	        	// invalid time -after 
	        	//email support
	        	result = "Invalid date or time for courier"
	        	return result
	        	break
	        case 'JOB_DISTANCE_NOT_ALLOWED':
	        	log.error "job distance not allowed"
	        	result = "Addresses must be in same city"
	        	return result
	        	break
	        case 'Address Missing':
	        	log.error "address is missing"
	        	result = "Address is missing. Please choose a Deliver and Return Address."
	        	return result
	        	break
	        case 'Unprocessable Entity':
	        	log.error "Unprocessable Entity"
	        	result = "Data would not validate - check address data, ensure phone number and address are valid."
	        	return result
	        	break
	        default:
	            result = "Error: notify support@pashiontool.com"
	            return result
	            break
	    } 
	}


}