package pashion

class PressHouse {
		//website, magazine, blog

    String name
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

        lastModifiedUserId nullable: true
        userCreatedId nullable: true
        stormpathDirectory nullable: true

        users nullable: true
    }

    
}
