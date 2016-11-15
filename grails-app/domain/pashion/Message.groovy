package pashion


class Message {

	User from

	String title
    String message


	//auto fields
	Date dateCreated
	Date lastUpdated

	static hasMany = [to:User]

	static belongsTo = []


	static constraints = {
		message nullable: true
		title nullable: true

	}
}
