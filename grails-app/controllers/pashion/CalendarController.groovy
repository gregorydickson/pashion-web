package pashion

import grails.converters.JSON

class CalendarController {

    def index() {
    	log.info "locale:"+request.locale
    	Map events = [3:"overdue",10:"international",12:"waiting"]
    	def aCalendar = new PashionCalendarMonth(events, 9,3,2016, request.locale.toString())

    	render aCalendar as JSON
    }
}
