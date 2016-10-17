package pashion

import java.time.LocalDate
import java.time.ZoneId

class SampleRequest {

	
	String idString
	Date dateRequested
	Date dateDue
	Date bookingStartDate
	Date bookingEndDate
	String requestStatus //"Requested", "Approved"
	Long userCreatedId
	
	Brand brand
	User receivingUser
	User requestingUser
	String receivingUserName
	String requestingUserName

	String editorial
	String comments

	Integer itemsGot
	Integer itemsOut

	//auto fields
	Date dateCreated
	Date lastUpdated
	Collection searchableItems

	static belongsTo = SearchableItem 

	static hasMany = [ searchableItems:SearchableItem ]

	PashionCalendar checkMonthForEvents(LocalDate localDate,
										PashionCalendar pashionCalendar){
		
		LocalDate start = bookingStartDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate()
		LocalDate end = bookingEndDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate()
		println "Sample Request - check month for events"
		if(pashionCalendar.calendarMonths[0].sameMonth(start)
		   && pashionCalendar.calendarMonths[0].sameMonth(end)) {
		   	println "check month for events - same month"
			pashionCalendar = inSameMonth(pashionCalendar, start, end)
		} else if (pashionCalendar.calendarMonths[0].sameMonth(start)){
			pashionCalendar = startInSameMonth()
		} else if(pashionCalendar.calendarMonths[0].sameMonth(end)){
			pashionCalendar = endInSameMonth(pashionCalendar, end)
		}
		pashionCalendar
	}

	PashionCalendar inSameMonth(PashionCalendar pashionCalendar, LocalDate start,
									LocalDate end){
		println "Sample Request - In Same Month"
		IntRange range = start.getDayOfMonth()..end.getDayOfMonth()
		range.each{
			pashionCalendar.calendarMonths[0].days[it].event = 
					pashionCalendar.calendarMonths[0].days[it].event + " not-available"
		}
		pashionCalendar

	}

	PashionCalendar startInSameMonth(PashionCalendar pashionCalendar, LocalDate start){
		IntRange range = start.getDayOfMonth()..pashionCalendar.calendarMonths[0].numberOfDays
		range.each{
			pashionCalendar.calendarMonths[0].days[it].event = 
						pashionCalendar.calendarMonths[0].days[it].event + " not-available"
		}
		pashionCalendar
	}

	PashionCalendar endInSameMonth(PashionCalendar pashionCalendar, LocalDate end){
		IntRange range = 1..end.getDayOfMonth()
		range.each{
			pashionCalendar.calendarMonths[0].days[it].event = 
						pashionCalendar.calendarMonths[0].days[it].event + " not-available"
		}
		pashionCalendar
	}
  	

	static constraints = {
		idString nullable: true
		dateRequested nullable: true
		dateDue nullable: true
		bookingStartDate nullable: true
	    bookingEndDate nullable: true
		requestStatus nullable: true
		userCreatedId nullable: true
		brand nullable:true 
		receivingUser nullable:true
		requestingUser nullable: true 
		receivingUserName nullable: true
		requestingUserName nullable: true 
		editorial nullable: true 
		comments nullable: true 

		itemsGot nullable: true
		itemsOut nullable: true 

		
	}
}
