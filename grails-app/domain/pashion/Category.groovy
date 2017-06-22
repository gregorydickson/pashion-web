package pashion

class Category{
	
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