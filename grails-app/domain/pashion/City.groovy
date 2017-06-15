package pashion

class City{
	String name

	static mapping = {
        cache false
    }

    String toString() {
        return name
    }
} 