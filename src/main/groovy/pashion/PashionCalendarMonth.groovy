package pashion

import groovy.transform.CompileStatic

import java.text.SimpleDateFormat

import grails.converters.JSON
import grails.converters.XML

import groovy.time.TimeCategory
import java.time.YearMonth
import java.time.LocalDate
import java.time.DayOfWeek
import java.time.temporal.WeekFields
import java.time.temporal.TemporalField
import java.time.format.TextStyle

@CompileStatic
class PashionCalendarMonth{

	Integer daysInMonth
	LocalDate localDate
	LocalDate start
	DayOfWeek firstDay
	
	List rows = []

	PashionCalendarMonth(Map events, Integer month, 
						Integer day, Integer year, String locale){
		
		Locale localeObject
		if(locale == "en") localeObject = Locale.US
		if(locale == "fr") localeObject = Locale.FRANCE
		if(locale == "es") localeObject = new Locale("es")
		def yearMonthObject = YearMonth.of(year, day)
		daysInMonth = yearMonthObject.lengthOfMonth()
		localDate = LocalDate.of(year, month, day)
		DayOfWeek dayOfWeek = localDate.getDayOfWeek()

		start = localDate.withDayOfMonth(1)
		firstDay = start.getDayOfWeek()
		
		def dayOfMonth = 1
		def aRow = []
		DayOfWeek dayNames = DayOfWeek.SUNDAY
		
		for(i in 0..6){
			def calendarday	 = new PashionCalendarDay()
			calendarday.dayString = dayNames.getDisplayName(TextStyle.SHORT, localeObject).toString()
			aRow <<  calendarday
			dayNames = dayNames.plus(1)
		}
		
		rows << aRow
		
		for(i in 1..5){
			def row = []
			for(j in 0..6){
				def calendarday	= new PashionCalendarDay()
				
				if(i == 1 && j >= firstDay.getValue()){
					calendarday.dayString = dayOfMonth.toString()
					dayOfMonth += 1
				} else if(i == 1 && j < firstDay.getValue()){
					calendarday.dayString = ""
				} else if (dayOfMonth > daysInMonth){
					
				} else {
					calendarday.dayString = dayOfMonth.toString()
					dayOfMonth += 1
				}
				//println calendarday as JSON
				row << calendarday
			}
			rows << row
		}
		rows.each{ row ->
			row.each{PashionCalendarDay pcd ->
				//if(events.containsKey(pcd.dayString)){
				//	pcd.event = [events[pcd.dayString]]
				//}
			}
		}
		
		
	}

	
}