package pashion



class User {

	String password
	Address address
	String title
	String phone
	String name
	String surname
	String email
	Boolean isInPashionNetwork = false
	String stormpathString
	String avatar

	City city

	String image

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
        pressHouse lazy:false
        brand lazy:false
        prAgency lazy:false
        
    }

	static constraints = {
		password nullable:true, maxSize: 2000
	}

	String toString(){
		return title+ " "+name + " "+ surname + " " + phone
	}

}
