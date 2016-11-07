package pashion


class Brand {

	String name
	String city
	String logo

	String stormpathDirectory 


	//auto fields
	Date dateCreated
	Date lastUpdated

	static searchable = true

	static hasMany = [brandCollections: BrandCollection,prAgencies:PRAgency,users:User]

	static belongsTo = []

	static mapping = {
        cache true
    }

	static constraints = {
		name nullable: true 
		city nullable: true 
		logo nullable: true
		stormpathDirectory nullable: true
		brandCollections nullable:true
		prAgencies nullable:true
		users nullable:true
	}
}
