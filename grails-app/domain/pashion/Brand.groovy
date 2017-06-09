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
		
	}

	String toString() {
        return name +" "+ hideCalendar
    }
}
