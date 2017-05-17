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

	static hasMany = [brands: Brand , users:User,addresses:Address,destinations:Address]
  	static belongsTo = Brand
    static constraints = {
    	stormpathDirectory nullable:true
        addresses nullable:true      
        destinations nullable: true
    }

    static mapping = {
        cache true
    }

    static mappedBy = [ addresses:"prAgency", 
                        destinations:"prDestination"]

    String toString() {
        return name
    }
}
