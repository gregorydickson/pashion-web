package pashion


class Brand {

	String name
	String logo

	String stormpathDirectory 

	//auto fields
	Date dateCreated
	Date lastUpdated
	Collection destinations
	Collection addresses

	static hasMany = [destinations:Address, brandCollections: BrandCollection,prAgencies:PRAgency,users:User,addresses:Address]

	static belongsTo = []

	static mappedBy = [ addresses:"brand", 
   					    destinations:"destination"]

	static mapping = {
        cache true
        sort "name"
    }

	static constraints = {
		destinations nullable: true
		name nullable: true 
		logo nullable: true
		stormpathDirectory nullable: true
		brandCollections nullable:true
		prAgencies nullable:true
		users nullable:true
		addresses nullable:true
	}

	String toString() {
        return name
    }
}
