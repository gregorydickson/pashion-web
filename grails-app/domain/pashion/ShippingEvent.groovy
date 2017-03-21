package pashion


class ShippingEvent {

	String status
	Date startDate
	Date endDate
	String courier
	String tracking
	String stuartStatus
	

	//auto fields
	Date dateCreated
	Date lastUpdated

	static belongsTo = [sampleRequest:SampleRequest]
	static mapping = {
        cache true
    }

	static constraints = {
		status nullable: true
        startDate nullable: true
        endDate nullable: true
        courier nullable: true
        tracking nullable: true
        sampleRequest nullable: true
        stuartStatus nullable: true
    }


}


