package pashion


class Message {

	User from
	User to
	String title
    String message


	//auto fields
	Date dateCreated
	Date lastUpdated

	static hasMany = []

	static belongsTo = []


	static constraints = {
		message nullable: true
		title nullable: true

	}
}
