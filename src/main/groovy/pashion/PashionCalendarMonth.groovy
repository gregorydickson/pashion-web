package pashion

import java.time.LocalDate
import groovy.transform.CompileStatic
import groovy.util.logging.Slf4j

@Slf4j
@CompileStatic
class PashionCalendarMonth{
	
	String year = ""
	String monthName = ""
	Integer monthNumber = 0
	Map days =[:]
	List rows = []
	List dayNames = []
	Integer numberOfDays = 0
	LocalDate localDate


	Boolean sameMonth(LocalDate theDate ){
		Boolean same = false
		if(localDate.getMonthValue() == theDate.getMonthValue() &&
			      localDate.getYear() == theDate.getYear()) {
			same = true
		} 
		same
	}
	//The month provided is before this PashionCalendarMonth
	Boolean beforeThisMonth(LocalDate startDate){
		Boolean before = false
		
		 
		if(localDate.getYear() < startDate.getYear()) {
			before = true
		} else if(localDate.getYear() == startDate.getYear() &&
				 startDate.getMonthValue() > localDate.getMonthValue()){
			before = true
		}
		before
	}
	//The month provided is after this PashionCalendarMonth
	Boolean afterThisMonth(LocalDate startDate){
		//println "*** input (now) ***" +startDate.getMonthValue()
		//println "*** calendar month value:" +localDate.getMonthValue()
		//println "calendar year:"+localDate.getYear()
		//println "date to check year:"+startDate.getYear()
		Boolean after = false
		if(localDate.getYear() > startDate.getYear()) {
			after = true
		} else if(localDate.getYear() == startDate.getYear() &&
				localDate.getMonthValue() < startDate.getMonthValue()){
			//println "after this month true"
			after = true
		}
		after
	}


}