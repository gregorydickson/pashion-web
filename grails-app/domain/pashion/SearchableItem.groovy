package pashion

import java.time.LocalDate
import java.time.ZoneId
import java.util.TimeZone

/*
 * A Searchable Item is the main domain object for Pashion's image search
 * a searchable item can be a Look, Sample, or Runway photo. 
 * a Look (a type of SearchableItem) will probably have samples (another type
 * of Searchable Item) associated with it. Hence the look attribute where
 * a Searchable Item can be self-referencing. Several data associations are
 * de-normalized to have the data directly on this object.
 */
class SearchableItem {

	Long id
	String clientID // The sample id that is used by the client
	String name //string for ID set by user For Look this is the Look ID which matches Vogue Runway
	String description
	Brand brand
	City city
	City sampleCity
	String sex
	OutReason outReason

	String image
	
	SearchableItemType type //Look or Sample or Runway
	Boolean isBookable = false
	Boolean isPrivate = false
	String imageProvider
	String imageProviderFileName
	
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

	String message

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

	static belongsTo = [brandCollection: BrandCollection]
	
	static hasMany = [ permissions:Permission, sampleRequests:SampleRequest, samples:SearchableItem]

	static mapping = {

		brand index: 'brand_idx'
		theme index: 'theme_idx'
		fromDate index: 'fromDate_idx'
		toDate index: 'toDate_idx'
		attributes index: 'attributes_idx'
		season index: 'season_idx'

		sampleRequests lazy: false
		samples lazy:false
		type lazy:false
		brandCollection lazy:false
		city lazy:false

		outReason lazy:false

		description type: 'text'

		cache true
		isBookable  defaultValue: false
	}

	static constraints = {
		description maxSize: 4000
	 	attributes  maxSize: 4000
	 	message maxSize: 4000
	}

	String toString(){
		return name +" sample city:" +sampleCity?.name
	}

	def notAvailable(SampleRequest sr){
		if(outReason){
			return true
		}
		TimeZone.setDefault(TimeZone.getTimeZone("Europe/London"))
		Date start = sr.bookingStartDate
        Date end = sr.bookingEndDate

        LocalDate startLocal = start.toInstant().atZone(ZoneId.systemDefault()).toLocalDate()
        LocalDate endLocal = end.toInstant().atZone(ZoneId.systemDefault()).toLocalDate()
        def notAvailable = false
        for(sampleRequest in sampleRequests){
			if(sr.id != sampleRequest.id &&
					(sampleRequest.requestStatusBrand == "Approved" ||
					sampleRequest.requestStatusBrand == "Picked Up" ||
					sampleRequest.requestStatusBrand == "Out")
			  ){
				if(sampleRequest.checkDateRangeForEvents(startLocal,endLocal)){
					notAvailable = true
					break
				}

			}
		}
		notAvailable
	}

		
	/**
	 * Goes through a Look and all Samples recursively to find all booked days in a month.
	 * Also, marks the current date with 'today'
	 *
	 * @param monthToCheck the month to use for finding any booked days
	 * @param pashionCalendar calendar to be mutated with any booked days for the monthToCheck
	 */
	PashionCalendar bookedDaysInMonth(LocalDate monthToCheck, PashionCalendar pashionCalendar){
		LocalDate now = new Date().toInstant().atZone(ZoneId.systemDefault()).toLocalDate()
		
		println "bookedDaysInMonth"
		if(pashionCalendar.calendarMonths[0].afterThisMonth(now)){
			println "searchableItem.bookedDaysInMonth, month is in the past so not available"
			pashionCalendar = monthNotAvailable(pashionCalendar)
			return pashionCalendar
		}
		//type 1 is Look which will have samples
		if(type.id == 1){
			println "searchableItem.bookedDaysInMonth :"+id+" - booked Days In Month - Look Case"
			samples.each{
				println "searchableItem.booked?DaysInMonth sample: "+it.id
				pashionCalendar = it.bookedDaysInMonth(monthToCheck, pashionCalendar)
			}
			
			if(pashionCalendar.calendarMonths[0].sameMonth(now)){
				pashionCalendar.calendarMonths[0].days[now.getDayOfMonth()].event = pashionCalendar.calendarMonths[0].days[now.getDayOfMonth()].event + " today"
				println "searchableItem.bookedDaysInMonth, today set here"
				pashionCalendar = currentMonth(pashionCalendar,now)
			}
			pashionCalendar = availableDaysInMonth(pashionCalendar)
		} else if(type.id == 2){//The SearchableItem is a Sample and can have requests
			println "searchableItem.bookedDaysInMonth - Im a sample:"+id+" - going through my sample requests"
			//log.info "sample requests:"+ sampleRequests
			sampleRequests.each{
				// println "searchableItem.nookedDaysInMonth a sample request"
				pashionCalendar = it.checkMonthForEvents(monthToCheck,pashionCalendar)
			}
			
		}
		pashionCalendar
	}




	// just set today ONLY
	PashionCalendar bookedDaysInMonthTodayOnly(LocalDate monthToCheck, PashionCalendar pashionCalendar){
		LocalDate now = new Date().toInstant().atZone(ZoneId.systemDefault()).toLocalDate()
		
		println "bookedDaysInMonthTodayOnly"
		//type 1 is Look which will have samples
		if(type.id == 1){
			println "searchableItem.bookedDaysInMonthTodayOnly :"+id+" - booked Days In Month - Look Case"
			samples.each{
				println "searchableItem.booked?DaysInMonth sample: "+it.id
				pashionCalendar = it.bookedDaysInMonthTodayOnly(monthToCheck, pashionCalendar)
			}
			
			if(pashionCalendar.calendarMonths[0].sameMonth(now)){
				pashionCalendar.calendarMonths[0].days[now.getDayOfMonth()].event = pashionCalendar.calendarMonths[0].days[now.getDayOfMonth()].event + " today"
				println "searchableItem.bookedDaysInMonth, today set here"
			}
		}

		pashionCalendar
	}






	PashionCalendar currentMonth(PashionCalendar pashionCalendar,LocalDate today){
		println "searchableItem.currentMonth"
		// println "currentMonth"
		IntRange range
		if(today.getDayOfMonth() > 1){
			range = 1..(today.getDayOfMonth()-1)
			range.each{
				println  "searchableItem.currentMonth, start in this month set not-available "+it
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
		LocalDate start
		println "searchableItem.availableDaysInMonth"
		if(fromDate){
			start = fromDate?.toInstant()?.atZone(ZoneId.systemDefault())?.toLocalDate()
		} else{
			start = new Date().toInstant().atZone(ZoneId.systemDefault()).toLocalDate()
		}
		switch(start){
		
			case {pashionCalendar.calendarMonths[0].sameMonth(start)}:
				println "searchableItem.availableDaysInMonth ***********  same month"
				pashionCalendar = startInThisMonth(pashionCalendar, start)
				break
			
			case {pashionCalendar.calendarMonths[0].beforeThisMonth(start)}:
				println "searchableItem.availableDaysInMonth *************    before this month"
				pashionCalendar = monthNotAvailable(pashionCalendar)
				break

			case {pashionCalendar.calendarMonths[0].afterThisMonth(start)}:
				println "searchableItem.availableDaysInMonth ***********       after this month"
				pashionCalendar = monthAvailable(pashionCalendar)
				break
		}
		pashionCalendar
	}


	PashionCalendar monthNotAvailable(PashionCalendar pashionCalendar){
		IntRange range = 1..pashionCalendar.calendarMonths[0].numberOfDays
		range.each{
			println "serachableItem.monthNotAvailable"
			pashionCalendar.calendarMonths[0].days[it].event = 
						pashionCalendar.calendarMonths[0].days[it].event + " not-available"
		}
		pashionCalendar
	}

	PashionCalendar monthAvailable(PashionCalendar pashionCalendar){
		
		IntRange range = 1..pashionCalendar.calendarMonths[0].numberOfDays
		range.each{
			println "searchableItem.monthAvailable"
			pashionCalendar.calendarMonths[0].days[it].event = 
						pashionCalendar.calendarMonths[0].days[it].event + " available"
		}
		pashionCalendar
	}

	PashionCalendar startInThisMonth(PashionCalendar pashionCalendar, LocalDate start){
		println "searchableItem.startInThisMonth"
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


}
