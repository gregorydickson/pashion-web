package pashion

import pashion.*
import java.text.SimpleDateFormat
import java.util.Date
import grails.converters.JSON
import grails.util.Environment




class BootStrap {
    def sessionFactory
    def grailsApplication
    def init = { servletContext ->
  
      def ctx = grailsApplication.mainContext
      def userService = ctx.userService

      JSON.registerObjectMarshaller(SearchableItem) {
        def returnArray = [:]
        returnArray['image'] = it.image
        returnArray['id'] =  it.id
        returnArray['name'] =  it.name
        returnArray['season'] = it.season.name
        returnArray['brand'] = it.brand.name
        returnArray['fromDate'] = it.fromDate
        returnArray['imageProvider'] = it.imageProvider
        return returnArray
      }
// RM don't remove this section, used by comms
      JSON.registerObjectMarshaller(User) {
        def returnArray = [:]
        returnArray['name'] = it.name
        returnArray['id'] =  it.id
        returnArray['email'] = it.email
        returnArray['surname'] = it.surname
        returnArray['brand'] = it.brand
        returnArray['pressHouse'] = it.pressHouse
        returnArray['address1'] = it.address?.address1
        returnArray['address2'] = it.address?.address2
        returnArray['city'] = it.address?.city
        returnArray['country'] = it.address?.country
        returnArray['postalCode'] = it.address?.postalCode
        return returnArray
      }

      JSON.registerObjectMarshaller(Brand) {
        def returnArray = [:]
        returnArray['name'] = it.name
        returnArray['id'] =  it.id
        return returnArray
      }

      JSON.registerObjectMarshaller(City) {
        def returnArray = [:]
        returnArray['name'] = it.name
        returnArray['id'] =  it.id
        return returnArray
      }
      if (Environment.current == Environment.PRODUCTION) {
        def ids = SampleRequest.executeQuery('select id from SampleRequest')
        for (id in ids) {
            SampleRequest.get(id)
        }
      }
        


       

    }
    def destroy = {
    }
}
