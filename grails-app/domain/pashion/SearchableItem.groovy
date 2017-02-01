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
	String name //string for ID set by user For Look this is the Look ID which matches Vogue Runway
	String description
	Brand brand
	City city
	City sampleCity
	String sex

	String image
	
	SearchableItemType type //Look or Sample or Runway
	Boolean isBookable = false
	String imageProvider
	
	// Start of searchable attributes
	String color
	String material
	String itemsInLook // type in Look data entry sheet
	String sampleType //if it is a sample, what is it
	String shape
	String accessories
	String occasion
	String style
	String motif
	String theme
	String culture
	String lookSeason //season in Look data etnry
	String decade
	String attributes  //all attributes space separated (tags)
					   // Used for full text searching
					   // e.g. red dress silk

	String path

	String size
	
	Season season

	Date fromDate

	Long userCreatedId
	Long lastModifiedUserId

	//auto fields
	Date dateCreated
	Date lastUpdated

	SearchableItem look //if this is a sample, then it has a Look
	User owner

	static constraints = {
		name nullable:true
		city nullable:true
		sampleCity nullable:true
		description nullable:true, maxSize: 1000
		brand nullable: true
		sex nullable:true
		type nullable: true
		image nullable:true

		imageProvider nullable:true

		color nullable: true
		material nullable: true
		itemsInLook nullable: true
		sampleType nullable:true
		shape nullable: true
	 	accessories nullable: true
	 	occasion nullable: true
	 	style nullable: true
	 	motif nullable: true
	 	theme nullable: true
	 	culture nullable: true
	 	lookSeason nullable: true
	 	decade nullable: true

	 	attributes nullable:true, maxSize: 1000

	 	path nullable:true

		size nullable: true
		theme nullable:true

		fromDate nullable:true
		
		look nullable: true 
		owner nullable:true
		
		userCreatedId nullable:true
		lastModifiedUserId nullable:true

		brandCollection nullable: true
		permissions nullable:true
		sampleRequests nullable:true
		samples nullable:true
	}

	String toString(){
		return name +" sample city:" +sampleCity.name
	}


		
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
				pashionCalendar.calendarMonths[0].days[now.getDayOfMonth()].event = pashionCalendar.calendarMonths[0].days[now.getDayOfMonth()].event + " today"
				pashionCalendar = currentMonth(pashionCalendar,now)
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

	PashionCalendar currentMonth(PashionCalendar pashionCalendar,LocalDate today){
		IntRange range
		if(today.getDayOfMonth() > 1){
			range = 1..(today.getDayOfMonth()-1)
			range.each{
				println "start in this month set not-available "+it
				pashionCalendar.calendarMonths[0].days[it].event =  "not-available"
			}
		}
		pashionCalendar
	}


	/**
	 * Goes through a Look object and marks all available days on the pashion calendar
	 * using the fromDate and ToDate on the Look (Samples don't use fromDate and ToDate).
	 * Used to mark available Days in a calendar month
	 *
	 * 
	 * @param pashionCalendar calendar to be mutated with any booked days for the monthToCheck
	 */
	PashionCalendar availableDaysInMonth(PashionCalendar pashionCalendar){
		LocalDate start = fromDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate()
		switch(start){
		
			case {pashionCalendar.calendarMonths[0].sameMonth(start)}:
				pashionCalendar = startInThisMonth(pashionCalendar, start)
				break
			
			case {pashionCalendar.calendarMonths[0].beforeThisMonth(start)}:
				log.info "before this month"
				pashionCalendar = monthNotAvailable(pashionCalendar)
				break

			case {pashionCalendar.calendarMonths[0].afterThisMonth(start)}:
				pashionCalendar = monthAvailable(pashionCalendar)
				break
		}
		pashionCalendar
	}

	PashionCalendar monthNotAvailable(PashionCalendar pashionCalendar){
		IntRange range = 1..pashionCalendar.calendarMonths[0].numberOfDays
		range.each{
			log.info "month not available"
			pashionCalendar.calendarMonths[0].days[it].event = 
						pashionCalendar.calendarMonths[0].days[it].event + " not-available"
		}
		pashionCalendar
	}

	PashionCalendar monthAvailable(PashionCalendar pashionCalendar){
		
		IntRange range = 1..pashionCalendar.calendarMonths[0].numberOfDays
		range.each{
			pashionCalendar.calendarMonths[0].days[it].event = 
						pashionCalendar.calendarMonths[0].days[it].event + " available"
		}
		pashionCalendar
	}

	PashionCalendar startInThisMonth(PashionCalendar pashionCalendar, LocalDate start){
		IntRange range
		if(start.getDayOfMonth() > 1){
			range = 1..(start.getDayOfMonth()-1)
			range.each{
				
				pashionCalendar.calendarMonths[0].days[it].event = 
							pashionCalendar.calendarMonths[0].days[it].event + " not-available"
			}
		}
		range = start.getDayOfMonth()..pashionCalendar.calendarMonths[0].numberOfDays
		range.each{
			pashionCalendar.calendarMonths[0].days[it].event = 
						pashionCalendar.calendarMonths[0].days[it].event + " available"
		}
		pashionCalendar
	}

	
	
	static belongsTo = [brandCollection: BrandCollection]
	

	static hasMany = [ permissions:Permission, sampleRequests:SampleRequest, samples:SearchableItem]

	
	static mapping = {

		brand index: 'brand_idx'
		theme index: 'theme_idx'
		fromDate index: 'fromDate_idx'
		toDate index: 'toDate_idx'

		attributes index: 'attributes_idx'
		season index: 'season_idx'

		sampleRequests lazy: true
		samples lazy:true
		type lazy:false
		brandCollection lazy:false
		city lazy:false

		description type: 'text'

		cache true
		isBookable  defaultValue: false
	}

}
