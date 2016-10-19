package pashion

import java.time.LocalDate
import groovy.transform.CompileStatic
import groovy.util.logging.Slf4j

@Slf4j
@CompileStatic
class PashionCalendarMonth{
	
	String year = ""
	String monthName = ""
	Map days =[:]
	List rows = []
	List dayNames = []
	Integer numberOfDays = 0
	LocalDate localDate


	Boolean sameMonth(LocalDate theDate ){
		
		if(localDate.getMonthValue() == theDate.getMonthValue() &&
			      localDate.getYear() == theDate.getYear()) {
			return true
		} else{
			return false
		}
	}


}