package pashion

import com.stormpath.sdk.account.Account


class User {
	Account account

	String name
	String surname
	String email

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
   	static transients = ['account']
	static constraints = {
		account nullable: true

		name nullable:true
		surname nullable:true
		email nullable: true
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
