package pashion

import groovy.transform.CompileStatic

@CompileStatic
class PashionCalendarDay{
	
	String dayString
	String event
	
	public void setDayString(Object displayString){
		dayString = displayString
	}

	public Object getDayString(){
		dayString
	}
}