package pashion

import grails.transaction.Transactional
import javax.annotation.PostConstruct


@Transactional
class UserService {

	def grailsApplication
	@PostConstruct
    def init(){
    	log.info "UserService:"+grailsApplication.metadata['stormpath.apiKey.id']
    	log.info "UserService2:"+grailsApplication.metadata['stormpath.apiKey.secret']
    
    }

    def login(){

    }


	
}
