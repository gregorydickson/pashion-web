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
	
	static searchable = true

	static belongsTo = [Look, BrandCollection]

	static hasMany = [ brandCollections:BrandCollection, looks:Look, permissions:Permission]

	static constraints = {
		color nullable: true
		type nullable: true
		material nullable: true
		size nullable: true
		status nullable: true 
		security nullable: true 

		fromDate nullable: true
		toDate nullable: true
		image nullable: true
		isPublic  nullable: true
		availability nullable: true
		userCreatedId nullable: true
		lastModifiedUserId nullable: true


		location nullable: true

		brandCollections nullable: true
		looks nullable: true
		permissions nullable: true
		
	}



}
