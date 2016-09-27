package pashion

class Look {
//A runway look, more than one piece, a top, trousers, assessories

	String name
	String description
	String image
	Integer status
	Integer security
	
	Integer availability
	Date fromDate
	Date toDate

	Long userCreatedId
	Long lastModifiedUserId

	//auto fields
	Date dateCreated
	Date lastUpdated
	
	static searchable = {
		collection component: true
		only: ['description','name']
	}

	static belongsTo = [collection: Collection]

	static hasMany = [ permissions:Permission, samples:Sample]

	static constraints = {
		description(nullable:true)
		image(nullable:true)
		status(nullable:true)
		security(nullable:true)
		availability(nullable:true)

		fromDate(nullable:true)
		toDate(nullable:true)
		
		userCreatedId(nullable:true)
		lastModifiedUserId(nullable:true)

		permissions(nullable:true)
		samples(nullable:true)
	}
}
