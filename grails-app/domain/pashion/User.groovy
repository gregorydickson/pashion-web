package pashion

import com.stormpath.sdk.account.Account

import com.bloomhealthco.jasypt.*


class User {
	Account account
	String password
	Address address
	String title
	String phone
	String name
	String surname
	String email
	Boolean isInPashionNetwork = false
	String stormpathString

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

   	static mapping = {
        cache true
        //stormpathString type: GormEncryptedStringType
        pressHouse lazy:false
        brand lazy:false
        prAgency lazy:false
        
    }
   	static transients = ['account','password']
	static constraints = {
		account nullable: true
		address nullable: true
		title nullable: true
		phone nullable: true
		name nullable:true
		surname nullable:true
		email nullable: true
		stormpathString nullable:true, maxSize: 1000
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
