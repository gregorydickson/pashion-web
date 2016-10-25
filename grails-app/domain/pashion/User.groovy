
package pashion



class User {

	String username
	String name

	String email
	String role 
	Long userCreatedId
	Date lastModifiedDate
	Long lastModifiedUserId

	//auto fields
	Date dateCreated
	Date lastUpdated

	static belongsTo = [ pressHouse:PressHouse,brand:Brand,prAgency:PRAgency]

	static hasMany = [connections:Connection,
	                 permissions:Permission,
	                 sampleRequestsSent: SampleRequest,
	                 sampleRequestsReceived: SampleRequest]

	
    static mappedBy = [ sampleRequestsSent:"requestingUser", 
   					    sampleRequestsReceived:"receivingUser"]
	static constraints = {

		username size: 1..100
		name size: 1..100

		email nullable: true
		role nullable: true, inList:['Brand','Admin','Press']
		userCreatedId nullable: true
		lastModifiedDate nullable: true
		lastModifiedUserId nullable: true


		pressHouse nullable: true
		brand nullable: true
		prAgency nullable: true

		sampleRequestsSent nullable: true
		sampleRequestsReceived nullable: true
		connections nullable: true
		permissions nullable: true

	}

}
