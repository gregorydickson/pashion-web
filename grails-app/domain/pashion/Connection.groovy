package pashion

class Connection {


	Long connectedUserId
	Integer connectionStatus
	Date lastModifiedDate
	Long lastModifiedUserId
	Long userCreatedId

	//auto fields
	Date dateCreated
	Date lastUpdated

	static belongsTo = [user:User]

	static constraints = {
		userCreatedId(nullable:true)
		lastModifiedUserId(nullable:true)
	}
}
