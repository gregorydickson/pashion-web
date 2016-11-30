package pashion


class ShippingEvent {

	String status
	Date startDate
	Date endDate
	String courier
	String tracking
	

	//auto fields
	Date dateCreated
	Date lastUpdated

	static belongsTo = [sampleRequest:SampleRequest]

	static constraints = {
		status nullable: true
        startDate nullable: true
        endDate nullable: true
        courier nullable: true
        tracking nullable: true
        sampleRequest nullable: true
    }


}


