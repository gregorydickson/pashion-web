package pashion

import grails.transaction.Transactional

@Transactional
class SampleRequestService {

    def list(params) {
    	SampleRequest.list(params)
    }
}
