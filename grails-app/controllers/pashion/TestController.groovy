package pashion

import static org.springframework.http.HttpStatus.*
import grails.transaction.Transactional
import grails.converters.JSON

@Transactional(readOnly = true)
class TestController {

	def stuartService

	def stuart(){
		//stuartService.createLocation()
		render 'done'
	}

}