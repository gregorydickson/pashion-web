package pashion

import groovyx.net.http.FromServer
import groovyx.net.http.ApacheHttpBuilder
import static groovyx.net.http.HttpBuilder.configure

import grails.transaction.Transactional
import reactor.spring.context.annotation.*

@Transactional
@Consumer
class InDigitalService {

    static scope = "singleton"
    def uri =  'http://indigitalimages.com'
    def downloadUri = 'http://indigitalimages.com/filemanager/download/sfilate/'
    
	String credentials = 'username=pashiontoolapi&password=3jpnb7buy3554t95'

	/*
		Params name:
		• catalogueId Catalogue	text	code
		• seasonId Season	text	code
		• genderId Gender	text	code
		• cityId City	text	code
		• designerId Designer	text	code
		• categoryId Category	text	code
		• page Page	number	(usually	in	the	first	call	is	omitted)
	*/
	def search(Map params){
		def action = 'search.do?'
		
		def path = "search.do?username=pashiontoolapi&password=3jpnb7buy3554t95"

		def http = ApacheHttpBuilder.configure {
		    	request.uri = uri
		}
		def search = http.get {
				
	    		request.uri.path = path
	    		
	    		response.success { FromServer from, Object body ->
	    			log.info "body:"+body
	        		return body
	    		}
		}
		search
	}
	// http://indigitalimages.com/indigital/api/
	// categories.do?username=api@indigitalimages.com&password=indigitalimages
	def categories(){	

		def page = configure {
    		request.uri = 'http://indigitalimages.com/indigital/api/categories.do?username=pashiontoolapi&password=3jpnb7buy3554t95'
		}.get()

		page

	}

}