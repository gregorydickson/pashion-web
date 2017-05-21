package pashion
//company that will represent many brands
// has many Brands

class PRAgency {

	String name
	String stormpathDirectory

	//auto fields
	Date dateCreated
	Date lastUpdated
    Collection destinations
    Collection addresses
    Boolean onlyShowMySampleRequests = true
    Boolean restrictOutsideBooking = true


	static hasMany = [brands: Brand , users:User,addresses:Address,destinations:Address]
  	static belongsTo = Brand


  	static mapping = {
        brands lazy: false
        cache true
    }

    

    static mappedBy = [ addresses:"prAgency", 
                        destinations:"prDestination"]

    String toString() {
        return name
    }
}
