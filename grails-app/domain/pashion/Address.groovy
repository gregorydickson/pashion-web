package pashion



class Address{
	String name
	String address1
	String address2
	String city
	String country
	String postalCode
	Boolean defaultAddress

	static mapping ={
		defaultAddress  defaultValue: false 
	}

	static constraints = {
		address1 nullable: true
		address2 nullable: true
		city nullable: true
		country nullable: true
		postalCode nullable: true
	}

}


