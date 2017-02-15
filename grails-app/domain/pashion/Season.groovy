package pashion

class Season{
	
	String name
	String abbreviation
	Integer order
	static mapping = {
        cache true
    }
    static constraints = {
		
		abbreviation nullable:true
	}
}