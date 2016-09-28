package pashion

class PressHouse {
		//website, magazine, blog

    String name
    Long lastModifiedUserId
    Long userCreatedId

	//auto fields
	Date dateCreated
	Date lastUpdated

	//Press House has many
	static hasMany = [users: User]

    static constraints = {
        name size: 1..100, blank: false

        lastModifiedUserId nullable: true
        userCreatedId nullable: true

        users nullable: true
    }

    
}
