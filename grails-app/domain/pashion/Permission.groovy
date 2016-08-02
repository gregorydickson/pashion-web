package pashion

class Permission {

	Date createdDate
	Long userCreatedId
  String name

	//auto fields
	Date dateCreated
	Date lastUpdated

	static belongsTo = [user:User, look:Look, sample:Sample, collection:Collection]

    static constraints = {
    	userCreatedId(nullable:true)
    	user nullable:true
    	look nullable: true
    	sample nullable: true
    	collection nullable: true
    }
}
