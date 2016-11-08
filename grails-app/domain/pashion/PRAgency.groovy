package pashion
//company that will represent many brands
// has many Brands

class PRAgency {

	String name
	String stormpathDirectory

	//auto fields
	Date dateCreated
	Date lastUpdated

	static hasMany = [brands: Brand , users:User,addresses:Address]
  	static belongsTo = Brand
    static constraints = {
    	stormpathDirectory nullable:true
        addresses nullable:true
    }

    static mapping = {
        cache true
    }
}
