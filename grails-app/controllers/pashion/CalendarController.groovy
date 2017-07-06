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

    def pastNotAvailable(){
        
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
        
        
        aCalendar = calendarService.pastNotAvailable(localDate,aCalendar)
            
        
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
        
        log.debug "searchableItemPicker"
        log.debug "brand :"+theItem.brand
        log.debug "params: "+params
        if(params.searchType == "brand" || theItem.brand.hideCalendar == false){
            aCalendar = calendarService.availableDaysInMonth(theItem,localDate,aCalendar)
            log.info "searchableItemPicker, show the brand availability"
        } else if (params.searchType != "brand" && theItem.brand.hideCalendar == true){
            //aCalendar = calendarService.availableDaysInMonthSetTodayOnly(theItem, localDate,aCalendar)
            aCalendar = calendarService.pastNotAvailable(localDate,aCalendar)
            log.info "searchableItemPicker, set today & past not available"
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
        
        log.info "datePickerNoAvailability"
        render aCalendar as JSON
    }


    // for a specific list of samples and the Look
    def showAvailabilityLookAndSamples(){
        def jsonObject = request.JSON
        log.info "showAvailabilityLookAndSamples json:"+jsonObject
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
        log.debug "showAvailabilityLookAndSamples"
        if(params.searchType == "brand" || samples[0].look.brand.hideCalendar == false){
            log.info "brand sample calendar OR show calenader"
            aCalendar = calendarService.availableDaysForALook(samples[0].look,aCalendar)
            aCalendar = calendarService.availableDaysForSamples(samples,localDate,aCalendar)
        } else if (params.searchType != "brand" && samples[0].look.brand.hideCalendar == true) {
                log.info "NOT brand sample calendar and hide calenadr"
                aCalendar = calendarService.pastNotAvailable(localDate,aCalendar)
            }
        render aCalendar as JSON
    }

    def showAvailabilitySamples(){
        def jsonObject = request.JSON
        log.info "showAvailabilitySamples json:"+jsonObject
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
        if (samples == []) {
            log.info "showAvailabilitySamples no samples, so all available after today"
            aCalendar = calendarService.pastNotAvailable(localDate,aCalendar)
        }
        else {
            log.info "showAvailabilitySamples"
            if(params.searchType == "brand" || samples[0].look.brand.hideCalendar == false){
                log.info "brand sample calendar OR show calenader"
                aCalendar = calendarService.availableDaysForSamples(samples,localDate,aCalendar)
                aCalendar = calendarService.pastNotAvailable(localDate,aCalendar)
            } else if (params.searchType != "brand" && samples[0].look.brand.hideCalendar == true) {
                log.info "NOT brand sample calendar and hide calenadr"
                aCalendar = calendarService.pastNotAvailable(localDate,aCalendar)
            }
        }

        render aCalendar as JSON
    }
}
