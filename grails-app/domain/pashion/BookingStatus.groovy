package pashion

class BookingStatus{
	
	Long itemId
	String status
	static belongsTo = [sampleRequest:SampleRequest]


}