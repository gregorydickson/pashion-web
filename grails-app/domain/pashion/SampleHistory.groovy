package pashion



class SampleHistory{
	//auto fields
	Date dateCreated
	Date lastUpdated

	Long itemId
	String previousStatus
	String newStatus

	static constraints = {
	}

	static mapping = {
       
    }

	String toString() {
        return dateCreated.toString() +" previous:"+ previousStatus +" new:"+newStatus
    }

}


