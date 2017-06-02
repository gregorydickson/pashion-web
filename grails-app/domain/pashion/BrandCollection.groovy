package pashion

class BrandCollection {


	Integer status
	Integer security
	
	Integer availability
	Date fromDate
	Date toDate

	Long userCreatedId
	Long lastModifiedUserId

	// Season: e.g. "Fall 2016”, “Spring 2017",
	//  "Winter 2017"
	Season season
	Category category
	

	//auto fields
	Date dateCreated
	Date lastUpdated


	static belongsTo = [brand:Brand]

	static hasMany = [ permissions:Permission, searchableItems:SearchableItem]

	static mapping = {
		season index: 'season_idx'
		category defaultValue: 0
		cache true
		
	}

	static constraints = {

		status nullable: true
		security nullable: true
		fromDate nullable: true
		toDate nullable: true

		availability nullable: true
		lastModifiedUserId nullable: true
		userCreatedId nullable:true
		season nullable: true
		category nullable: true
		
		
		permissions nullable: true 
		searchableItems nullable: true

	}
}
