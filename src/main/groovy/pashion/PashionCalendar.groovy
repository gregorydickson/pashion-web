package pashion

import groovy.transform.CompileStatic

import java.text.SimpleDateFormat

import grails.converters.JSON
import grails.converters.XML

import groovy.time.TimeCategory
import java.time.YearMonth
import java.time.Month
import java.time.LocalDate
import java.time.DayOfWeek
import java.time.temporal.WeekFields
import java.time.temporal.TemporalField
import java.time.format.TextStyle

@CompileStatic
class PashionCalendar{

	
	List calendarMonths = []
	List daysOfWeek = null
	

	PashionCalendar(Map events, Integer month, 
						Integer day, Integer year, String locale,
						 Integer offset, Integer months){
		
		
		
		LocalDate localDate
		
		Locale localeObject = null
		//println "locale:"+locale
		if(locale == "en" || locale == "en_US") localeObject = Locale.US
		if(locale == "fr") localeObject = Locale.FRANCE
		if(locale == "es") localeObject = new Locale("es")
		if(localeObject == null) localeObject = Locale.US
		def yearMonthObject = YearMonth.of(year, month)
		
		localDate = LocalDate.of(year, month, day)
		if(offset != 0)localDate = localDate.plusMonths((long) offset)
		
		//DayOfWeek dayOfWeek = localDate.getDayOfWeek()
		DayOfWeek dayNames = DayOfWeek.SUNDAY
		for(i in 0..months){
			calendarMonths << makeMonth(events, dayNames, localeObject,localDate, i  )
		}
		
		
		
	}

	PashionCalendarMonth makeMonth(Map events, DayOfWeek dayNames,
								   Locale localeObject,
								   LocalDate localDate,
								   Integer increment){
		
		
		PashionCalendarMonth month = new PashionCalendarMonth()
		Integer dayOfMonth = 1
		
		localDate = localDate.plusMonths((long) increment)
		LocalDate start = localDate.withDayOfMonth(1)
		Integer daysInMonth = localDate.lengthOfMonth()
		month.monthName = localDate.getMonth().getDisplayName(TextStyle.FULL,localeObject)
		month.year = localDate.getYear().toString()
		DayOfWeek firstDay = start.getDayOfWeek()
		if(daysOfWeek == null){
			daysOfWeek = []
			for(i in 0..6){
				def calendarday	 = new PashionCalendarDay()
				calendarday.dayString = dayNames.getDisplayName(TextStyle.SHORT, localeObject)
				daysOfWeek <<  calendarday
				dayNames = dayNames.plus(1)
			}
		} 
		month.dayNames << daysOfWeek
		//how many
		for(i in 1..6){
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
			def first = (PashionCalendarDay) row[0]
			if(i == 6 && first.dayString == ""){
				//empty sixth row
			} else{
				month.rows << row
			}
		}
		month.rows.each{ row ->
			row.each{PashionCalendarDay pcd ->
				if(events.containsKey(pcd.dayString )){
					pcd.event = events[pcd.dayString]
				}
			}
		}
		month
	}

	
}