package pashion


class ShippingEvent {

	Date startDate
	Date endDate
	String courier
	

	//auto fields
	Date dateCreated
	Date lastUpdated

	static belongsTo = [sampleRequest:SampleRequest]

	static constraints = {
        startDate nullable: true
        endDate nullable: true
        courier nullable: true
    }


}


