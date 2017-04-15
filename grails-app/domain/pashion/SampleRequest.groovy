package pashion

import java.time.LocalDate
import java.time.ZoneId

class SampleRequest {

	
	String idString
	String season
	String image
	String look
	Date dateRequested

	Date bookingStartDate
	Date bookingEndDate
	String requestStatusBrand //Pending ->Approved->Shipped -> Delivered -> Due Back ->Overdue ->Closed
	String requestStatusPress
	Boolean overdue = false
	Long userCreatedId
	
	Brand brand

	PressHouse pressHouse
	Address addressDestination
	Address returnToAddress

	String courierOut
	String courierReturn
	String paymentOut
	String paymentReturn
	User receivingUser 
	User requestingUser 
	User deliverTo
	String emailNotification
	
	String returnBy
	String requiredBy

	String overview
	
	
	// Pickup Date is the Date for the courier pickup
	Date pickupDate
	Date pickupDateReturn
	String pickupTime
	String pickupTimeReturn
	

	String editorialName
	String editorialWho
	Date editorialWhen

	//auto fields
	Date dateCreated
	Date lastUpdated

	Collection searchableItems  //approved Items
	Collection searchableItemsProposed // proposed Items
	Collection searchableItemsDenied
	Collection<BookingStatus> searchableItemsStatus

	ShippingEvent shippingOut
	ShippingEvent shippingReturn

	static constraints = {
		
		season nullable:true
		image nullable: true
		look nullable:true
		searchableItems nullable:true
		searchableItemsProposed nullable: true
		idString nullable: true
		dateRequested nullable: true
		emailNotification nullable: true

		bookingStartDate nullable: true
	    bookingEndDate nullable: true
		requestStatusBrand nullable: true 
		requestStatusPress nullable: true
		userCreatedId nullable: true
		brand nullable:true
		
		deliverTo nullable:true

		pressHouse nullable: true
		courierOut nullable: true
		courierReturn nullable: true
		receivingUser nullable:true
		requestingUser nullable: true 

		overview nullable:true

		
		pickupDate nullable: true
		pickupTime nullable: true
		pickupDateReturn nullable: true
		pickupTimeReturn nullable: true
	 	

		editorialName nullable: true 
		editorialWho nullable: true 
		editorialWhen nullable: true 

		shippingOut nullable: true 
		shippingReturn nullable: true

		searchableItemsStatus nullable:true
		
	}


	static mapping = {
        cache true
        searchableItems lazy:false
        brand lazy:false
        deliverTo lazy: false
        searchableItemsProposed lazy: false
        searchableItems lazy:false
        searchableItemsDenied lazy:false
        shippingOut lazy:false
        shippingReturn lazy:false
        searchableItemsStatus lazy:false
        requestingUser lazy: false

        receivingUser lazy:false
	
        returnToAddress lazy:false
        addressDestination lazy:false
        pressHouse lazy: false

    }

	static belongsTo = SearchableItem 

	static hasMany = [ searchableItems:SearchableItem,
					   searchableItemsProposed:SearchableItem,
					   searchableItemsDenied:SearchableItem ]

	PashionCalendar checkMonthForEvents(LocalDate localDate,
										PashionCalendar pashionCalendar){
		
		LocalDate start = bookingStartDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate()
		LocalDate end = bookingEndDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate()
		log.info "Sample Request - check month for events"
		if(pashionCalendar.calendarMonths[0].sameMonth(start)
		   && pashionCalendar.calendarMonths[0].sameMonth(end)) {
		   	log.info "check month for events - same month"
			pashionCalendar = inSameMonth(pashionCalendar, start, end)
		} else if (pashionCalendar.calendarMonths[0].sameMonth(start)){
			pashionCalendar = startInSameMonth(pashionCalendar,start)
		} else if(pashionCalendar.calendarMonths[0].sameMonth(end)){
			pashionCalendar = endInSameMonth(pashionCalendar, end)
		}
		pashionCalendar
	}

	PashionCalendar inSameMonth(PashionCalendar pashionCalendar, LocalDate start,
									LocalDate end){
		log.info "Sample Request - In Same Month"
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
  	

	
}
