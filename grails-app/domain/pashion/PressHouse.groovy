package pashion

class PressHouse {
		//website, magazine, blog

    String name
    String address1
    String address2
    String address3

    Long lastModifiedUserId
    Long userCreatedId
    String stormpathDirectory 

	//auto fields
	Date dateCreated
	Date lastUpdated

	//Press House has many
	static hasMany = [users: User]

    static mapping = {
        cache true
    }

    static constraints = {
        name size: 1..100, blank: false

        address1 nullable: true
        address2 nullable: true
        address3 nullable: true

        lastModifiedUserId nullable: true
        userCreatedId nullable: true
        stormpathDirectory nullable: true

        users nullable: true
    }

    
}
