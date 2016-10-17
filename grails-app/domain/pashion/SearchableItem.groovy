package pashion

import java.time.LocalDate
import java.time.ZoneId

/*
 * A Searchable Item is the main domain object for Pashion's image search
 * a searchable item can be a Look, Sample, or Runway photo. 
 * a Look (a type of SearchableItem) will probably have samples (another type
 * of Searchable Item) associated with it.
 */
class SearchableItem {

	Long id
	String name
	Brand brand

	String image
	String color
	SearchableItemType type //Look or Sample or Runway
	String material
	String size
	String theme

	Season season

	Date fromDate
	Date toDate

	Long userCreatedId
	Long lastModifiedUserId

	//auto fields
	Date dateCreated
	Date lastUpdated

	SearchableItem look


	PashionCalendar bookedDaysInMonth(LocalDate monthToCheck, PashionCalendar pashionCalendar){
		println "Searchable Item - bookedDaysInMonth"
		//type 1 is Look which will have samples
		if(type.id == 1){
			println "SearchableItem:"+id+" - booked Days In Month - Look Case"
			samples.each{
				println "sample: "+it.id
				pashionCalendar = it.bookedDaysInMonth(monthToCheck, pashionCalendar)
			}
			LocalDate now = new Date().toInstant().atZone(ZoneId.systemDefault()).toLocalDate()
			if(pashionCalendar.calendarMonths[0].sameMonth(now)){
				pashionCalendar.calendarMonths[0].days[now.getDayOfMonth()].event =
					pashionCalendar.calendarMonths[0].days[now.getDayOfMonth()].event + " today"
			}
			pashionCalendar = availableDaysInMonth(pashionCalendar)
		} else if(type.id == 2){//The SearchableItem is a Sample and can have requests
			println "SearchableItem - Im a sample:"+id+" - going through my sample requests"
			println "sample requests:"+ sampleRequests
			sampleRequests.each{
				println "a sample request"
				pashionCalendar = it.checkMonthForEvents(monthToCheck,pashionCalendar)
			}
			
		}
		pashionCalendar
	}



	PashionCalendar availableDaysInMonth(PashionCalendar pashionCalendar){
		LocalDate start = fromDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate()
		LocalDate end = toDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate()
		println "Searchable Item - available days in month"
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
					pashionCalendar.calendarMonths[0].days[it].event + " available"
		}
		pashionCalendar

	}

	PashionCalendar startInSameMonth(PashionCalendar pashionCalendar, LocalDate start){
		IntRange range = start.getDayOfMonth()..pashionCalendar.calendarMonths[0].numberOfDays
		range.each{
			pashionCalendar.calendarMonths[0].days[it].event = 
						pashionCalendar.calendarMonths[0].days[it].event + " available"
		}
		pashionCalendar
	}

	PashionCalendar endInSameMonth(PashionCalendar pashionCalendar, LocalDate end){
		IntRange range = 1..end.getDayOfMonth()
		range.each{
			pashionCalendar.calendarMonths[0].days[it].event = 
						pashionCalendar.calendarMonths[0].days[it].event + " available"
		}
		pashionCalendar
	}
	
	static belongsTo = [brandCollection: BrandCollection]
	

	static hasMany = [ permissions:Permission, sampleRequests:SampleRequest, samples:SearchableItem]

	static mapping = {
		type index: 'type_idx'
		theme index: 'theme_idx'
		fromDate index: 'fromDate_idx'
		toDate index: 'toDate_idx'
		color index: 'color_idx'

		sampleRequests lazy: false
		samples lazy:false
		type lazy:false

	}

	static constraints = {
		name nullable:true
		brand nullable: true

		image nullable:true
		color nullable: true
		type nullable: true
		material nullable: true
		size nullable: true
		theme nullable:true

		fromDate nullable:true
		toDate nullable:true
		
		look nullable: true 
		
		userCreatedId nullable:true
		lastModifiedUserId nullable:true

		brandCollection nullable: true
		permissions nullable:true
		sampleRequests nullable:true
		samples nullable:true
	}
}
