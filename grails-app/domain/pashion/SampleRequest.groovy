package pashion


class SampleRequest {

	
	String idString
	Date dateRequested
	Date dateDue
	String requestStatus
	Long userCreatedId
	
	Brand brand
	User receivingUser
	User requestingUser
	String receivingUserName
	String requestingUserName

	String editorial
	String comments

	Integer itemsGot
	Integer itemsOut

	//auto fields
	Date dateCreated
	Date lastUpdated

	static searchable = true

	static hasMany = [ samples:Sample, looks: Look ]
  	

	static constraints = {
		idString nullable: true
		dateRequested nullable: true
		dateDue nullable: true
		status nullable: true
		userCreatedId nullable: true
		brand nullable:true 
		receivingUser nullable:true
		requestingUser nullable: true 
		receivingUserName nullable: true
		requestingUserName nullable: true 
		editorial nullable: true 
		comments nullable: true 

		itemsGot nullable: true
		itemsOut nullable: true 

		samples nullable: true 
		looks nullable:true
	}
}
