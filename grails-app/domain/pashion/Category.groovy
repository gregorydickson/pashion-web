package pashion

class Category{
	
	String name
	String abbreviation
	static mapping = {
        cache true
    }
    static constraints = {
		
		abbreviation nullable:true
	}
}