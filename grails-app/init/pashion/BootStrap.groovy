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
        returnArray['imageSource'] = it.imageSource
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

      def dateFormatString = "yyyy-MM-dd"
      SimpleDateFormat dateFormat =  new SimpleDateFormat(dateFormatString)
      def itemtype1 = SearchableItemType.findOrSaveWhere(display:'Looks',searchCode:'look').save(failOnError : true)
      def itemtype2 = SearchableItemType.findOrSaveWhere(display:'Samples',searchCode:'sample').save(failOnError : true)
      def itemtype3 = SearchableItemType.findOrSaveWhere(display:'Runway',searchCode:'runway').save(failOnError : true)

      

      
        


       

    }
    def destroy = {
    }
}
