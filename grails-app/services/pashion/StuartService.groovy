package pashion

import groovyx.net.http.FromServer
import groovyx.net.http.HttpBuilder


class StuartService {

    static scope = "singleton"
    def uri =  'https://sandbox-api.stuart.com'

    def clientID = "a9a96844e2a2e78208b3327d03ac105f6cdf842d404cec8006c12e7969104630"
	def secret = "60d76bb547879450f03927dc501f5c2ef8d00c2188c684bc955fb06edde1f0c3"
	def token = null
     
    
    
	def token(){
		def newToken = null
		KeyValue.withTransaction { status ->
			def current = KeyValue.findByItemKey("stuart")
			if(current == null)
				current = new KeyValue(itemKey:'stuart')
		
			def http = HttpBuilder.configure {
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
		newToken

	}

	def test(){
		
	}
}