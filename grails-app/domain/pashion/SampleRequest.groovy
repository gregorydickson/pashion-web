package pashion


class SampleRequest {

	static mapping = {

	}
	String requestingDate
	String status
	Long userCreatedId
	User requestingUser

	//auto fields
	Date dateCreated
	Date lastUpdated

	static hasMany = [ samples:Sample]
  static belongsTo = [User, Sample]
	static constraints = {
	}
}
