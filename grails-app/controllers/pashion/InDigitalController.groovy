package pashion

import static org.springframework.http.HttpStatus.*
import grails.transaction.Transactional
import grails.converters.JSON


@Transactional(readOnly = true)
class InDigitalController {

	def inDigitalService

	def index(){
		
		def categories = inDigitalService.categories()

		render categories
	}
}