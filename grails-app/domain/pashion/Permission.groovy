package pashion

class Permission {

	Date createdDate
	Long userCreatedId
    String name

	//auto fields
	Date dateCreated
	Date lastUpdated

	static belongsTo = [user:User,searchableItem:SearchableItem, brandCollection:BrandCollection]

    static constraints = {
    	userCreatedId nullable:true 
    	user nullable:true
    	brandCollection nullable: true
        searchableItem nullable:true
    }
}
