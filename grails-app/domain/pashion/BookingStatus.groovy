package pashion

class BookingStatus{
	
	Long itemId
	String brandStatus
	String pressStatus
	static belongsTo = [sampleRequest:SampleRequest]


}