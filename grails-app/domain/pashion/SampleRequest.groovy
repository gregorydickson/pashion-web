package pashion


import java.time.LocalDate
import java.time.ZoneId
import java.util.TimeZone


/**
 * SampleRequest.groovy
 *
 * DeliverTo is the User that is set if a sampleRequest is to a User.
 * A SampleRequest may be sent to an ad-hoc address. if that is the case
 * then no DeliverTo User is set. The service will attempt to set 
 * an addressDestination from the DeliverTo user or an ad-hoc address returned
 * in the DeliverTo json, which can be a user or an address.
 * 
 * receivingUser is from the original data modeling and is deprecated.
 * 
 * returnToAddress will be the address of the  or the
 * default address for the Brand or PR Agency.
 * 
 * use of requestingUser was originally to be a Press User as the idea was
 * requests would be Press to Brand. However, a requestingUser is the user that
 * originated the request which may be Brand, Press, or PR Agency.
 *
 * 
 */
class SampleRequest {

	
	String idString
	String season
	String image
	String look
	Date dateRequested

	Date bookingStartDate
	Date bookingEndDate
	//Trolley storage
	String startDay
    String startDate
    String startMonth
    String endDay
    String endDate
    String endMonth
    String startOffset
    String endOffset

	String requestStatusBrand 
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
	
	//receivingUser deprecated - not used
	User receivingUser 
	//
	
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
		children cascade:"all-delete-orphan"
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
					   searchableItemsDenied:SearchableItem,
					   searchableItemsStatus:BookingStatus ]

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
