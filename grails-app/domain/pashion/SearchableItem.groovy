package pashion

class SearchableItem {
//A runway look, more than one piece, a top, trousers, assessories

	String name
	Brand brand

	String image
	String color
	SearchableItemType type //Look or Sample
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
	
	static belongsTo = [brandCollection: BrandCollection]

	static hasMany = [ permissions:Permission, sampleRequests:SampleRequest, samples:SearchableItem]

	static mapping = {
		type index: 'type_idx'
		theme index: 'theme_idx'
		fromDate index: 'fromDate_idx'
		toDate index: 'toDate_idx'
		color index: 'color_idx'
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
