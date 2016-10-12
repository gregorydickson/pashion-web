package pashion

import grails.transaction.Transactional
import java.text.SimpleDateFormat
import java.time.LocalDate

@Transactional
class CalendarService {

    Map availableDaysInMonthSample(SearchableItem sample,LocalDate localDate ) {
    	Integer daysInMonth = localDate.lengthOfMonth()
    }

    Map availableDaysInMonthLook(SearchableItem look, LocalDate localDate){
    	
    }
}
