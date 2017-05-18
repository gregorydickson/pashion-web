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

  	static mapping = {
        brands lazy: false
        cache true
    }
    static belongsTo = pashion.Brand

    static constraints = {
    }

    String toString() {
        return name
    }
}
