package pashion


class Brand {

	String name
	String logo


	//auto fields
	Date dateCreated
	Date lastUpdated
	Collection destinations
	Collection addresses
	Boolean hideCalendar = false
	Boolean onlyShowMySampleRequests = true
	Boolean restrictOutsideBooking = true

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
        return name +" "+ hideCalendar
    }
}
