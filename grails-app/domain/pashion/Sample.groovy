package pashion

//Samples are the Items in a Look. For example, a skirt, or handbag
class Sample {

	String name
	String color
	String type
	String material
	String size
	Integer status
	Integer security
	Integer isPublic
	Integer availability
	Date fromDate
	Date toDate
	String image

	Long userCreatedId
	Long lastModifiedUserId

	String location
	//e.g. RL London

	//auto fields
	Date dateCreated
	Date lastUpdated

	static belongsTo = [Look, Collection]

	static hasMany = [ collections:Collection, looks:Look,sampleRequests:SampleRequest, permissions:Permission,accessories:Sample]

	static constraints = {
		color nullable: true
		type nullable: true
		material nullable: true
		size nullable: true
		fromDate nullable: true
		toDate nullable: true
		isPublic  nullable: true
		userCreatedId nullable: true
		lastModifiedUserId nullable: true

		location nullable: true

		collections nullable: true
		looks nullable: true
		sampleRequests nullable: true
		accessories nullable: true
	}



}
