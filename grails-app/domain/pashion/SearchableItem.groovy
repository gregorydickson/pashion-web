package pashion

import java.time.LocalDate

/*
 * A Searchable Item is the main domain object for Pashion's image search
 * a searchable item can be a Look, Sample, or Runway photo. 
 * a Look will probably have samples associated with it.
 */
class SearchableItem {


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
			println "SearchableItem - booked Days In Month - Look Case"
			samples.each{
				println "SearchableItem - I'm a look - going through my samples"
				pashionCalendar = it.bookedDaysInMonth(monthToCheck, pashionCalendar)
			}
		} else if(type.id == 2){//The SearchableItem is a Sample and can have requests
			println "SearchableItem - Im a sample - going through my sample requests"
				
			sampleRequests.each{
				pashionCalendar = it.checkMonthForEvents(monthToCheck,pashionCalendar)
			}
			
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
