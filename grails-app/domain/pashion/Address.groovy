package pashion



class Address{
	String company
	String name
	String address1
	String address2
	String city
	String country
	String postalCode
	String attention
	String contactPhone
	String stuartId
	String comment
	Boolean defaultAddress = false
	Boolean archived = false

	PressHouse pressHouse
	PRAgency prAgency
	PRAgency prDestination
	Brand brand
	Brand destination

	static constraints = {
	}

	static mapping = {
        cache true
    }

	String toString() {
		if(brand)
        	return brand.toString() +" "+ name
        if(pressHouse)
        	return pressHouse.toString()+" "+ name
        if(prAgency)
        	return prAgency.toString()+" "+ name
    }

}


