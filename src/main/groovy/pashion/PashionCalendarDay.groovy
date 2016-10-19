package pashion

import groovy.transform.CompileStatic
import groovy.util.logging.Slf4j

@Slf4j
@CompileStatic
class PashionCalendarDay{
	
	String dayString
	String event = ""
	
	public void setDayString(Object displayString){
		dayString = displayString
	}

	public Object getDayString(){
		dayString
	}
}