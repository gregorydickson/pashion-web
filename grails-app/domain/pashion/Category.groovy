package pashion

class Category{
	
	String name
	String abbreviation
	Integer order
	String path
	static mapping = {
        cache true
    }
    static constraints = {
		name()
		abbreviation nullable:true
	}
	String toString(){
		return name
	}
}