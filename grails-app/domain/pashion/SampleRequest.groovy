package pashion


class SampleRequest {

	
	String idString
	Date dateRequested
	Date dateDue
	Date bookingStartDate
	Date bookingEndDate
	String requestStatus //"Requested", "Approved"
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

	static belongsTo = SearchableItem

	static hasMany = [ searchableItems:SearchableItem ]
  	

	static constraints = {
		idString nullable: true
		dateRequested nullable: true
		dateDue nullable: true
		bookingStartDate nullable: true
	    bookingEndDate nullable: true
		requestStatus nullable: true
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

		searchableItems nullable: true 
		
	}
}
