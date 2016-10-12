package pashion

import grails.converters.JSON
import java.text.SimpleDateFormat
import java.time.LocalDate

class CalendarController {
    
    def calendarService
    def index() {
    	log.info "locale:"+request.locale
    	log.info "offset:"+params.offset
    	log.info "day:"+params.day
    	log.info "month:"+params.month
    	log.info "year:"+params.year
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
        log.info "item:"+params.item

        log.info "locale:"+request.locale
        log.info "offset:"+params.offset
        log.info "day:"+params.day
        log.info "month:"+params.month
        log.info "year:"+params.year
        SearchableItem theItem = SearchableItem.get(params.item)
        
        def dateFormatString = "yyyy-MM-dd"
        def dateFormat =  new SimpleDateFormat(dateFormatString)

        def today = dateFormat.parse(params.year+"-"+
                                         params.month+"-"+
                                         params.day)
        //checkavailable days
        def localDate = LocalDate.of(params.year.toInteger(),
                                     params.month.toInteger(),
                                     params.day.toInteger())
        

        Map events = [:]
        def aCalendar = new PashionCalendar( events,
                                             params.month.toInteger(),
                                             params.day.toInteger(),
                                             params.year.toInteger(),
                                             request.locale.toString(),
                                             params.offset.toInteger(),
                                             params.months.toInteger())

        render aCalendar as JSON

    }
}
