
package pashion

class User {

	String username
	String name
	String password
	String email
	String role
	Long userCreatedId
	Date lastModifiedDate
	Long lastModifiedUserId
	Integer viewed

	//auto fields
	Date dateCreated
	Date lastUpdated

	static belongsTo = [ pressHouse:PressHouse,brand:Brand,prAgency:PRAgency]

	static hasMany = [sampleRequests:SampleRequest,connections:Connection,permissions:Permission]

	static constraints = {

		username size: 1..100
		name size: 1..100
		password size: 1..500
		email nullable: true
		role nullable: true
		userCreatedId nullable: true
		lastModifiedUserId nullable: true
		viewed nullable: true

		pressHouse nullable: true
		brand nullable: true
		prAgency nullable: true

		sampleRequests nullable: true
		connections nullable: true
		permissions nullable: true

	}

}
