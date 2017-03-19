package pashion

class KeyValue {

	String itemKey	
	String itemValue
	Date expires
	

	static constraints = {
		 itemKey  maxSize: 1000
		 itemValue maxSize: 1000
		 expires nullable:true
	}

	static mapping = {
        cache false
    }



}


