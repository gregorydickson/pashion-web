package pashion

import grails.converters.JSON

class CalendarController {
    

    def index() {
    	log.info "locale:"+request.locale
    	log.info "offset:"+params.offset
    	log.info "day:"+params.day
    	log.info "month:"+params.month
    	log.info "year:"+params.year
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
        log.info "item:"+params.item

        log.info "locale:"+request.locale
        log.info "offset:"+params.offset
        log.info "day:"+params.day
        log.info "month:"+params.month
        log.info "year:"+params.year
        SearchableItem theItem = SearchableItem.get(params.item)

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
