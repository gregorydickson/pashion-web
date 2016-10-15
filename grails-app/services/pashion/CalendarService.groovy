package pashion

import grails.transaction.Transactional
import java.text.SimpleDateFormat
import java.time.LocalDate

@Transactional
class CalendarService {


    PashionCalendar availableDaysInMonth(SearchableItem look, LocalDate localDate,
    							         PashionCalendar pashionCalendar){
    	log.info "Calendar Service - available Days in Month"
    	pashionCalendar = look.bookedDaysInMonth(localDate, pashionCalendar)

    }


    PashionCalendar availableDaysForSamples(List samples, LocalDate localDate,
    							            PashionCalendar pashionCalendar) {

    }
}
