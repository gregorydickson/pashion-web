package pashion

class BrandCollection {

	Brand brand
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


	

	static hasMany = [searchableItems:SearchableItem]

	static mapping = {
		season index: 'season_idx'
		category defaultValue: 0
		cache true
		
	}

	static constraints = {

		

	}
}
