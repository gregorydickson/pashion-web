package pashion

class Connection {


	Long connectedUserId


	String connectingStatus
	// Date lastModifiedDate
	// Long lastModifiedUserId
	// Long userCreatedId
	Integer numberNewMessages
	String mostRecentRead
	String lastMessage
	String name


	//auto fields
	//Date dateCreated
	//Date lastUpdated

	static belongsTo = [user:User]
	static mapping = {
        cache true
    }

	static constraints = {
		numberNewMessages(nullable:true)
		mostRecentRead size:1..25
		//userCreatedId(nullable:true)
		//lastModifiedUserId(nullable:true)
		//lastModifiedUserId(nullable:true)
	}
}
