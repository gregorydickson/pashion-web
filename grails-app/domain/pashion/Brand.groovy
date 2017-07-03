package pashion


class Brand {

	String name
	String logo


	//auto fields
	Date dateCreated
	Date lastUpdated
	
	// destinations are ad-hoc addresses, added by a Brand user in CreateSampleRequest
	Collection destinations

	//addresses are offices in the UI, one can be marked default
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
		name()
		
	}

	String toString() {
        return name +" "+ hideCalendar
    }
}
