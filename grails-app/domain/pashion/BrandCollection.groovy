package pashion

class BrandCollection {


	Integer status
	Integer security
	
	Integer availability
	Date fromDate
	Date toDate

	Long userCreatedId
	Long lastModifiedUserId

	// Season: e.g. "Fall 2016 Ready-to-Wear”, “Spring 2017 Couture",
	//  "Winter 2017 Menswear"
	String season
	

	//auto fields
	Date dateCreated
	Date lastUpdated

	static searchable = true

	static belongsTo = [brand:Brand]

	static hasMany = [looks: Look, permissions:Permission, samples:Sample]

	static mapping = {
		season index: 'season_idx'

		
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
		
		looks nullable: true
		permissions nullable: true 
		samples nullable: true

	}
}
