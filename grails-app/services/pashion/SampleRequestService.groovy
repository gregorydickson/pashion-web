package pashion

import grails.transaction.Transactional

@Transactional
class SampleRequestService {

    def listByUserOrganization(User user) {
    	def criteria = SampleRequest.createCriteria()
        List results

        if(user.brand){
            def brand = user.brand
            results = criteria.listDistinct () {
                eq('brand',brand)
            }
        }
        if(user.pressHouse){
            def presshouse = user.pressHouse
            results = criteria.listDistinct () {
                eq('pressHouse',presshouse)
            }
        }
        results
    }
}
