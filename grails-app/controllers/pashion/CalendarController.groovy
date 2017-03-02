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
        log.debug "brand:"+theItem.brand
        log.debug "params:"+params
        if(params.searchType == "brand" || theItem.brand.hideCalendar == false){
            aCalendar = calendarService.availableDaysInMonth(theItem,localDate,aCalendar)
            log.debug "show the brand availability"
        } 
        
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


    // for a specific list of samples and the Look
    def showAvailabilityLookAndSamples(){
        def jsonObject = request.JSON
        log.info "json:"+jsonObject
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
        log.debug "showing availability for Look and Samples"
        if(params.searchType == "brand" || samples[0].look.brand.hideCalendar == false){
            aCalendar = calendarService.availableDaysForALook(samples[0].look,aCalendar)
            aCalendar = calendarService.availableDaysForSamples(samples,localDate,aCalendar)
        }
        render aCalendar as JSON
    }

    def showAvailabilitySamples(){
        def jsonObject = request.JSON
        log.info "json:"+jsonObject
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
        log.debug "showing availability for Samples"
        if(params.searchType == "brand" || samples[0].look.brand.hideCalendar == false)
            aCalendar = calendarService.availableDaysForSamples(samples,localDate,aCalendar)
        render aCalendar as JSON
    }
}
