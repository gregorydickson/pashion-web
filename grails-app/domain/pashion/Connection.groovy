package pashion

class Connection {


	Long connectedUserId
	String email
	String name 
	String surname

	String connectingStatus
	// Date lastModifiedDate
	// Long lastModifiedUserId
	// Long userCreatedId
	Integer numberNewMessages


	//auto fields
	//Date dateCreated
	//Date lastUpdated

	static belongsTo = [user:User]

	static constraints = {
		numberNewMessages(nullable:true)
		//userCreatedId(nullable:true)
		//lastModifiedUserId(nullable:true)
		//lastModifiedUserId(nullable:true)
	}
}
