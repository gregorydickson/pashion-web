package pashion

import grails.converters.JSON
import java.text.SimpleDateFormat
import java.time.LocalDate

class CalendarController {
    
    def calendarService
    def index() {
    	log.debug "locale:"+request.locale
    	log.debug "offset:"+params.offset
    	log.debug "day:"+params.day
    	log.debug "month:"+params.month
    	log.debug "year:"+params.year
    	Map events = ["3":"overdue","10":"international","12":"waiting"]
        //TODO: look up this user's events and add them for current month
    	def aCalendar = new PashionCalendar( events,
    										 params.month.toInteger(),
    										 params.day.toInteger(),
    										 params.year.toInteger(),
    										 request.locale.toString(),
    										 params.offset.toInteger(),
                                             params.months.toInteger())

    	render aCalendar as JSON
    }

    def searchableItemPicker(){

        SearchableItem theItem = SearchableItem.get(params.item)
        
        def localDate = LocalDate.of(params.year.toInteger(),
                                     params.month.toInteger(),
                                     params.day.toInteger())
        
        def aCalendar = new PashionCalendar( null,
                                             params.month.toInteger(),
                                             params.day.toInteger(),
                                             params.year.toInteger(),
                                             request.locale.toString(),
                                             params.offset.toInteger(),
                                             params.months.toInteger())
        
        log.debug "Calendar Controller - Searchable Item Picker"
        aCalendar = calendarService.availableDaysInMonth(theItem,localDate,aCalendar)
        render aCalendar as JSON
    }

    def datePickerNoAvailability(){
        
        def localDate = LocalDate.of(params.year.toInteger(),
                                     params.month.toInteger(),
                                     params.day.toInteger())
        
        def aCalendar = new PashionCalendar( null,
                                             params.month.toInteger(),
                                             params.day.toInteger(),
                                             params.year.toInteger(),
                                             request.locale.toString(),
                                             params.offset.toInteger(),
                                             params.months.toInteger())
        
        log.debug "Calendar Controller - Searchable Item Picker"
        render aCalendar as JSON
    }



    def updateAvailabilitySamples(){
        def jsonObject = request.JSON
        List samples = []
        jsonObject.each{
            samples << SearchableItem.get(it)
        }
        
        def localDate = LocalDate.of(params.year.toInteger(),
                                     params.month.toInteger(),
                                     params.day.toInteger())

        def aCalendar = new PashionCalendar( null,
                                             params.month.toInteger(),
                                             params.day.toInteger(),
                                             params.year.toInteger(),
                                             request.locale.toString(),
                                             params.offset.toInteger(),
                                             params.months.toInteger())
        log.debug "updating availability"
        aCalendar = calendarService.availableDaysForALook(samples[0].look,aCalendar)
        aCalendar = calendarService.availableDaysForSamples(samples,localDate,aCalendar)
        render aCalendar as JSON
    }
}
