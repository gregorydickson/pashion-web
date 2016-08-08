package pashion

class Collection {

	String image

	Integer status
	Integer security
	Integer isPublic
	Integer availability
	Date fromDate
	Date toDate

	Long userCreatedId
	Long lastModifiedUserId
	Integer year
	Integer season
	String sex

	//auto fields
	Date dateCreated
	Date lastUpdated

	static belongsTo = [brand:Brand]

	static hasMany = [looks: Look, permissions:Permission, samples:Sample]

	static constraints = {
		image nullable: true
		fromDate nullable: true
		toDate nullable: true
		isPublic nullable: true
		lastModifiedUserId nullable: true
		year nullable: true
		season nullable: true
		sex nullable: true, inList:["Men's","Women's"]

	}
}
