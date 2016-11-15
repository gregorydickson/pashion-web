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
	String name //string for ID set by user
	String description
	Brand brand
	String sex

	String image
	String color
	SearchableItemType type //Look or Sample or Runway
	String material
	String sampleType
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
	User owner
		
	/**
	 * Goes through a Look and all Samples recursively to find all booked days in a month.
	 * Also, marks the current date with 'today'
	 *
	 * @param monthToCheck the month to use for finding any booked days
	 * @param pashionCalendar calendar to be mutated with any booked days for the monthToCheck
	 */
	PashionCalendar bookedDaysInMonth(LocalDate monthToCheck, PashionCalendar pashionCalendar){
		log.info "Searchable Item - bookedDaysInMonth"
		//type 1 is Look which will have samples
		if(type.id == 1){
			log.info "SearchableItem:"+id+" - booked Days In Month - Look Case"
			samples.each{
				log.info "sample: "+it.id
				pashionCalendar = it.bookedDaysInMonth(monthToCheck, pashionCalendar)
			}
			LocalDate now = new Date().toInstant().atZone(ZoneId.systemDefault()).toLocalDate()
			if(pashionCalendar.calendarMonths[0].sameMonth(now)){
				pashionCalendar.calendarMonths[0].days[now.getDayOfMonth()].event =
					pashionCalendar.calendarMonths[0].days[now.getDayOfMonth()].event + " today"
			}
			pashionCalendar = availableDaysInMonth(pashionCalendar)
		} else if(type.id == 2){//The SearchableItem is a Sample and can have requests
			log.info "SearchableItem - Im a sample:"+id+" - going through my sample requests"
			log.info "sample requests:"+ sampleRequests
			sampleRequests.each{
				log.info "a sample request"
				pashionCalendar = it.checkMonthForEvents(monthToCheck,pashionCalendar)
			}
			
		}
		pashionCalendar
	}


	/**
	 * Goes through a Look object and marks all available days on the pashion calendar
	 * using the fromDate and ToDate on the Look (Samples don't use fromDate and ToDate).
	 * Used to mark available Days in a calendar month
	 *
	 * @param monthToCheck the month to use for finding any booked days
	 * @param pashionCalendar calendar to be mutated with any booked days for the monthToCheck
	 */
	PashionCalendar availableDaysInMonth(PashionCalendar pashionCalendar){
		LocalDate start = fromDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate()
		LocalDate end = toDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate()
		log.info "Searchable Item - available days in month"
		if(pashionCalendar.calendarMonths[0].sameMonth(start)
		   && pashionCalendar.calendarMonths[0].sameMonth(end)) {

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
		log.info "Sample Request - start and end In Same Month"
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
		brandCollection lazy:false

		description type: 'text'

		cache true

	}

	static constraints = {
		name nullable:true
		description nullable:true
		brand nullable: true
		sex nullable:true

		image nullable:true
		color nullable: true

		type nullable: true
		material nullable: true
		sampleType nullable:true
		size nullable: true
		theme nullable:true

		fromDate nullable:true
		toDate nullable:true
		
		look nullable: true 
		owner nullable:true
		
		userCreatedId nullable:true
		lastModifiedUserId nullable:true

		brandCollection nullable: true
		permissions nullable:true
		sampleRequests nullable:true
		samples nullable:true
	}
}
