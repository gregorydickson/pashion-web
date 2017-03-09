package pashion

class City{
	String name

	static mapping = {
        cache true
    }

    String toString() {
        return name
    }
} 