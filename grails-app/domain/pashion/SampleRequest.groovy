package pashion


import java.time.LocalDate
import java.time.ZoneId
import java.util.TimeZone


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
	Boolean finalize = false
	Boolean datesSaved = false
	Long userCreatedId
	
	Brand brand

	PressHouse pressHouse
	PRAgency prAgency
	String requestingUserCompany
	Address addressDestination
	Address returnToAddress

	String courierOut
	Boolean courierOutNotification = false
	String courierReturn
	Boolean courierReturnNotification = false
	String paymentOut
	String paymentReturn
	User receivingUser 
	User requestingUser 
	User approvingUser
	String approvingUserCompany
	User deliverTo
	String emailNotification
	
	String returnBy
	String requiredBy

	String overview

	String message
	
	
	// Pickup Date is the Date for the courier pickup
	Date pickupDate
	Date pickupDateReturn
	String pickupTime
	String pickupTimeReturn

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
		
		message maxSize: 4000
		
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
        approvingUser lazy: false

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
		if(requestStatusBrand == 'Approved' || 
			requestStatusBrand == 'Picked Up' || 
			requestStatusBrand == 'Returning'){
			IntRange range = start.getDayOfMonth()..end.getDayOfMonth()
			range.each{
				pashionCalendar.calendarMonths[0].days[it].event = 
						pashionCalendar.calendarMonths[0].days[it].event + " not-available"
			}
		}
		pashionCalendar

	}

	PashionCalendar startInSameMonth(PashionCalendar pashionCalendar, LocalDate start){
		if(requestStatusBrand == 'Approved' || 
			requestStatusBrand == 'Picked Up' || 
			requestStatusBrand == 'Returning'){
			IntRange range = start.getDayOfMonth()..pashionCalendar.calendarMonths[0].numberOfDays
			range.each{
				pashionCalendar.calendarMonths[0].days[it].event = 
							pashionCalendar.calendarMonths[0].days[it].event + " not-available"
			}
		}
		pashionCalendar
	}

	PashionCalendar endInSameMonth(PashionCalendar pashionCalendar, LocalDate end){
		if(requestStatusBrand == 'Approved' || 
			requestStatusBrand == 'Picked Up' || 
			requestStatusBrand == 'Returning'){
			IntRange range = 1..end.getDayOfMonth()
			range.each{
				pashionCalendar.calendarMonths[0].days[it].event = 
							pashionCalendar.calendarMonths[0].days[it].event + " not-available"
			}
		}
		pashionCalendar
	}

	def checkDateRangeForEvents(LocalDate start, LocalDate end){
		LocalDate startDate = bookingStartDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate()
		LocalDate endDate = bookingEndDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate()

		if (
			(start.isEqual(startDate) || start.isAfter(startDate)) &&
		 	(end.isEqual(endDate) || end.isBefore(endDate))
		   ){
		 	return true
		} else{
		 	return false
		 }
	}
  	

	
}
