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

	Long userCreatedId
	Long lastModifiedUserId
  String City
  String Country

	//auto fields
	Date dateCreated
	Date lastUpdated

	static belongsTo = Look

	static hasMany = [ looks:Look,sampleRequests:SampleRequest, permissions:Permission,accessories:Sample]

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

		city nullable: true, inList: ["London", "Paris", "Milan"]
		country nullable: true, inList: ["UK", "France", "Italy"]

		looks nullable: true
		sampleRequests nullable: true
		accessories nullable: true
	}



}
