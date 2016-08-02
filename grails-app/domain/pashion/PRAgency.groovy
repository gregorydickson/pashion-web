package pashion
//company that will represent many brands
// has many Brands

class PRAgency {

	String name

	//auto fields
	Date dateCreated
	Date lastUpdated

	static hasMany = [brands: Brand , users:User]
  static belongsTo = Brand
    static constraints = {

    }
}
