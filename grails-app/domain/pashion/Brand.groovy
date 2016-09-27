package pashion


class Brand {

	String name
	String city
	String logo




	//auto fields
	Date dateCreated
	Date lastUpdated

	static searchable = true

	static hasMany = [collections: Collection,pRAgencies:PRAgency,users:User]

	static belongsTo = []


	static constraints = {
		name nullable: true 
		city nullable: true 
		logo nullable: true
		collections nullable:true
		pRAgencies nullable:true
		users nullable:true
	}
}
