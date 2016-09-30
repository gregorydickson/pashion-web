package pashion

class Booking {

	Date bookingStartDate
	Date bookingEndDate
	Long userCreatedId

	//auto fields
	Date dateCreated
	Date lastUpdated
	
	static searchable = true

	static hasMany = [ samples:Sample, looks:Look]

	static constraints = {
		samples nullable: true
		looks nullable: true

	}
}
