package pashion

import grails.converters.JSON

class APIInterceptor {
 
    public APIInterceptor() {
        
        match controller: 'sampleRequest'
        match controller: 'searchableItem', action:'filterSearch'
        match controller: 'searchableItem', action:'show'

        
    }
    
    boolean before() {
        // if the user has not been authenticated,
        // redirect to authenticate the user...
        if(!session.user) {
            log.info "no session in API Interceptor"
            def res = [session:'invalid'] as JSON
            render res
            return false
        }
        true
    }

}
