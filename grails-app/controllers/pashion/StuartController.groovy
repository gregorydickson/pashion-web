package pashion

import static org.springframework.http.HttpStatus.*
import grails.transaction.Transactional
import grails.converters.JSON


@Transactional(readOnly = true)
class StuartController {

	def stuartService

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
		def update = request.JSON
		ShippingEvent shippingEvent = ShippingEvent.findByStuartJobId(update.data.id)
		shippingEvent.status = update.data.status
		shippingEvent.stuartStatus = update.data.status

		shippingEvent.save(failOnError:true,flush:true)

		

	}

}