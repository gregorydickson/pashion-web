package pashion

import grails.transaction.Transactional

@Transactional
class SampleRequestService {

    def listByUserOrganization(User user) {
    	def criteria = SampleRequest.createCriteria()
        List results = []

        if(user?.brand){
            log.info "brand user get sample requests"
            def brand = user.brand
            results = criteria.listDistinct () {
                eq('brand',brand)
            }
        }
        if(user?.pressHouse){
            log.info "press user get sample requests"
            def pressHouse = user.pressHouse
            results = criteria.listDistinct () {
                eq('pressHouse',pressHouse)
            }
        }
        results
    }
}
