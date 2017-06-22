package pashion

class OutReason{
	String name
	Integer order

	static mapping = {
        cache false
    }

    String toString() {
        return name
    }
}