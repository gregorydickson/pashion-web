package pashion


import java.text.SimpleDateFormat
import java.time.LocalDate
import java.time.ZoneId


class CalendarService {

	static transactional = false

    PashionCalendar pastNotAvailable( LocalDate localDate,
                                         PashionCalendar pashionCalendar){
        log.info "pastNotAvailable"
	   LocalDate now = new Date().toInstant().atZone(ZoneId.systemDefault()).toLocalDate()
       if(pashionCalendar.calendarMonths[0].beforeThisMonth(now)){
            pashionCalendar = monthNotAvailable(pashionCalendar)
            return pashionCalendar
        }
        if(pashionCalendar.calendarMonths[0].sameMonth(now)){
            pashionCalendar.calendarMonths[0].days[now.getDayOfMonth()].event = pashionCalendar.calendarMonths[0].days[now.getDayOfMonth()].event + " today"
            log.info "pastNotAvailbe, today set here"
            
            IntRange range
            if(now.getDayOfMonth() > 1){
                range = 1..(now.getDayOfMonth()-1)
                range.each{
                    log.info "Day Not Available:"+it
                    pashionCalendar.calendarMonths[0].days[it].event =  "not-available"
                }
            }
        }
        pashionCalendar
    }
    //Shows availability for a Look and all its Samples
    PashionCalendar availableDaysInMonth(SearchableItem look, LocalDate localDate,
    							         PashionCalendar pashionCalendar){
    	log.info "availableDaysInMonth"
    	pashionCalendar = look.bookedDaysInMonth(localDate, pashionCalendar)

    }
    //Sets today only
    PashionCalendar  availableDaysInMonthSetTodayOnly(SearchableItem look, LocalDate localDate,
                                         PashionCalendar pashionCalendar){
        log.info "availableDaysInMonthSetTodayOnly"
        pashionCalendar = look.bookedDaysInMonthTodayOnly(localDate, pashionCalendar)

    }



    //Used for just the Look
    PashionCalendar availableDaysForALook(SearchableItem look, PashionCalendar pashionCalendar){
        pashionCalendar = look.availableDaysInMonth(pashionCalendar)
        log.info "availableDaysForALook"
    }
    //Used for Specific Samples - Not all samples in a Look
    PashionCalendar availableDaysForSamples(List samples, LocalDate localDate,
    							            PashionCalendar pashionCalendar) {
        log.info "availaleDaysForSamples"
    	samples.each{
    		pashionCalendar = it.bookedDaysInMonth(localDate,pashionCalendar)
    	}
    	LocalDate now = new Date().toInstant().atZone(ZoneId.systemDefault()).toLocalDate()
    	if(pashionCalendar.calendarMonths[0].sameMonth(now)){
				pashionCalendar.calendarMonths[0].days[now.getDayOfMonth()].event =
					pashionCalendar.calendarMonths[0].days[now.getDayOfMonth()].event + " today"
                    log.info "availableDaysForSamples, today set here"
			}
    	pashionCalendar
    }


    PashionCalendar monthNotAvailable(PashionCalendar pashionCalendar){
        log.info "monthNotAvailable"
        IntRange range = 1..pashionCalendar.calendarMonths[0].numberOfDays
        range.each{
            log.info "month not available"
            pashionCalendar.calendarMonths[0].days[it].event = 
                        pashionCalendar.calendarMonths[0].days[it].event + " not-available"
        }
        pashionCalendar
    }
}
