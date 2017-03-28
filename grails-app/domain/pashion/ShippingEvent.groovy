package pashion


class ShippingEvent {

	String status
	Date startDate
	Date endDate
	String courier
	String tracking
	String stuartQuoteId
	String stuartJobId
	String stuartStatus
	String stuartJSON
	String transportType
	BigDecimal finalAmount
	String currency
	

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
        stuartQuoteId nullable:true
        stuartJobId nullable:true
        sampleRequest nullable: true
        stuartStatus nullable: true
        stuartJSON nullable:true
        transportType nullable:true
        finalAmount nullable:true
        currency nullable: true
    }


}


