package pashion


class Brand {

	String name
	String city
	String logo


	Long lastModifiedUserId
	Long userCreatedId

	//auto fields
	Date dateCreated
	Date lastUpdated

	static hasMany = [collections: Collection,PRAgencies:PRAgency,users:User]

	static belongsTo = []


	static constraints = {
		logo nullable: true
		lastModifiedUserId nullable: true
		brandAgency nullable: true
	}
}
