package pashion

class Connection {


	Long connectedUserId


	String connectingStatus
	// Date lastModifiedDate
	// Long lastModifiedUserId
	// Long userCreatedId
	Integer numberNewMessages
	String mostRecentRead


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
