package pashion

import static org.springframework.http.HttpStatus.*
import grails.transaction.Transactional
import grails.converters.JSON
import groovy.time.*


@Transactional(readOnly = true)
class StuartController {

	def stuartService
	def sampleRequestService

	def index(){
		Address address1 = Address.get(61)
		Address address2 = Address.get(62)
		ShippingEvent event = ShippingEvent.get(294)
		def response = stuartService.createJobQuote(address1,address2,event,"Scooter")
		response = stuartService.createJob(address1,address2,response)

		render 'done'
	}


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
			ShippingEvent shippingEvent = ShippingEvent.findByStuartJobId(update.data.id)
			shippingEvent.status = update.data.status
			shippingEvent.stuartStatus = update.data.status

			shippingEvent.save(failOnError:true,flush:true)
		}
		response.status = 200
		render([status: 'updated'] as JSON)

	}

	def bookOut(){
		def message
        def sr = sampleRequestService.updateSampleRequest(request.JSON)
        def shippingEvent = sr.shippingOut
        shippingEvent = stuartService.createJobQuote(sr.returnToAddress,
        							sr.addressDestination,shippingEvent,"Scooter")
        log.info "quote:"+shippingEvent
        if(shippingEvent.error != null){
        	log.error "quote ERROR"
        	message = [message:shippingEvent.error]
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

		shippingEvent = stuartService.createJob(theDate,sr.returnToAddress,sr.addressDestination,shippingEvent)
        if(shippingEvent.hasProperty("message")){
        	log.error "stuart error message:"+shippingEvent.message
        	message = [message:message(shippingEvent.message)]
        }else{
        	message = [message:"Messenger Booked"]
        	response.status = 200
        }
        render message as JSON
	}

	def bookReturn(){
		def message
		def sr = sampleRequestService.updateSampleRequest(request.JSON)
        def shippingEvent = sr.shippingReturn
        shippingEvent = stuartService.createJobQuote(sr.addressDestination,
        								sr.returnToAddress,shippingEvent,"Scooter")
        log.info "quote:"+shippingEvent
        if(shippingEvent.hasProperty("error")){
        	message = [message:shippingEvent.error]
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
        
		shippingEvent = stuartService.createJob(theDate,sr.addressDestination,sr.returnToAddress,shippingEvent)
        if(shippingEvent.hasProperty("message")){
        	log.info "Stuart message"
        	message = [message:message(shippingEvent.message)]
        }else{
        	message = [message:"Messenger Booked"]
        	response.status = 200
        }
        render message as JSON
	}


	def message(response){
		def result
		switch (response) {
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
	        	result = "Invalid time"
	        	return result
	        	break
	        default:
	            result = response
	            return result
	            break
	    } 
	}






}