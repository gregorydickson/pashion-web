package pashion


import java.text.SimpleDateFormat
import java.time.LocalDate
import java.time.ZoneId


class CalendarService {

	static transactional = false
	
    //Shows availability for a Look and all its Samples
    PashionCalendar availableDaysInMonth(SearchableItem look, LocalDate localDate,
    							         PashionCalendar pashionCalendar){
    	log.info "Calendar Service - available Days in Month"
    	pashionCalendar = look.bookedDaysInMonth(localDate, pashionCalendar)

    }
    //Used for just the Look
    PashionCalendar availableDaysForALook(SearchableItem look, PashionCalendar pashionCalendar){
        pashionCalendar = look.availableDaysInMonth(pashionCalendar)
    }
    //Used for Specific Samples - Not all samples in a Look
    PashionCalendar availableDaysForSamples(List samples, LocalDate localDate,
    							            PashionCalendar pashionCalendar) {
    	samples.each{
    		pashionCalendar = it.bookedDaysInMonth(localDate,pashionCalendar)
    	}
    	LocalDate now = new Date().toInstant().atZone(ZoneId.systemDefault()).toLocalDate()
    	if(pashionCalendar.calendarMonths[0].sameMonth(now)){
				pashionCalendar.calendarMonths[0].days[now.getDayOfMonth()].event =
					pashionCalendar.calendarMonths[0].days[now.getDayOfMonth()].event + " today"
			}
    	pashionCalendar
    }
}
