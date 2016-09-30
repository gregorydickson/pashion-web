package pashion

class Look {
//A runway look, more than one piece, a top, trousers, assessories

	String name
	String description
	String image
	String type
	String color
	String theme
	Integer status
	Integer security

	
	Integer availability
	Date fromDate
	Date toDate

	Long userCreatedId
	Long lastModifiedUserId

	//auto fields
	Date dateCreated
	Date lastUpdated

	static namedQueries = {
        filterResults { brand, season, type, availableFrom, availableTo, keywords ->
            brandCollection{
            	if(brand) eq('brand', brand)
            	if(season) eq('season',season)
            }
            if(type) eq('type',type)
            if(availableFrom && availableTo) or {
            	between('fromDate', availableFrom, availableTo)
            	between('toDate', availableFrom, availableTo)
            }
            
            
            
            
        }
    }
	
	
	static searchable = {
		brandCollection parent: true, reference: true
	}

	static belongsTo = [brandCollection: BrandCollection]

	static hasMany = [ permissions:Permission, samples:Sample]

	static mapping = {
		type index: 'type_idx'
		theme index: 'theme_idx'
		fromDate index: 'fromDate_idx'
		toDate index: 'toDate_idx'
		color index: 'color_idx'
	}

	static constraints = {
		name nullable:true
		description nullable:true
		image nullable:true
		type nullable: true
		color nullable: true
		theme nullable:true
		status nullable:true
		security nullable:true
		availability nullable:true

		fromDate nullable:true
		toDate nullable:true
		
		userCreatedId nullable:true
		lastModifiedUserId nullable:true

		permissions nullable:true
		samples nullable:true
	}
}
