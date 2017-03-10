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
	Boolean defaultAddress = false
	Boolean archived = false

	PressHouse pressHouse
	PRAgency prAgency
	Brand brand
	Brand destination

	static constraints = {
		company nullable:true
		brand nullable: true 
		destination nullable:true
		pressHouse nullable:true
		prAgency nullable:true
		address1 nullable: true
		address2 nullable: true
		city nullable: true
		country nullable: true
		postalCode nullable: true
		attention nullable:true
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


