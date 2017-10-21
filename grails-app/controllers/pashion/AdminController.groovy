package pashion

import static org.springframework.http.HttpStatus.*
import grails.transaction.Transactional
import grails.converters.JSON

@Transactional(readOnly = true)
class AdminController {


    def removeAgencyBookings(Integer id) {
    	PRAgency agency = PRAgency.get()//Add id here to enable

        List bookings = SampleRequest.findAllByPrAgency(agency)
        
        bookings.each{ booking ->
        	def ids = booking.searchableItems.collect{it.id}
        	ids.each{booking.removeFromSearchableItems(SearchableItem.get(it))}
        	ids = booking.searchableItemsProposed.collect{it.id}
        	ids.each{booking.removeFromSearchableItemsProposed(SearchableItem.get(it))}
        	ids = booking.searchableItemsDenied.collect{it.id}
        	ids.each{booking.removeFromSearchableItemsDenied(SearchableItem.get(it))}
        }

        bookings*.delete(flush:true,failOnError:true)
        render "done"
        return
        
    }

    def removeBrandBookings() {
    	// add the name of the brand here
    	Brand brand = Brand.findByNameIlike("") 

        List bookings = SampleRequest.findAllByBrand(brand)
        
        bookings.each{ booking ->
        	def ids = booking.searchableItems.collect{it.id}
        	ids.each{booking.removeFromSearchableItems(SearchableItem.get(it))}
        	ids = booking.searchableItemsProposed.collect{it.id}
        	ids.each{booking.removeFromSearchableItemsProposed(SearchableItem.get(it))}
        	ids = booking.searchableItemsDenied.collect{it.id}
        	ids.each{booking.removeFromSearchableItemsDenied(SearchableItem.get(it))}
        }

        bookings*.delete(flush:true,failOnError:true)
        render "removed bookings for:"+brand.name
        return
        
    }

    def removeBrand() {

    	Brand brand
    	Brand.withTransaction { status ->
    		
    	
    		brand = Brand.findByNameIlike("")//Add name here to enable
    		log.info "removing brand:"+brand.name
	    	
	    	def agencies = brand.prAgencies
	    	List agencyIds = agencies.collect{it.id}
	    	if(agencyIds){
	    		agencyIds.each{
	    			PRAgency agency = PRAgency.get(it)
	    			agency.removeFromBrands(brand)
	    			agency.save(flush:true,failOnError:true)
	    		}
	    		
	    	}

	        List bookings = SampleRequest.findAllByBrand(brand)
	        
	        bookings.each{ booking ->
	        	def ids = booking.searchableItems.collect{it.id}
	        	ids.each{booking.removeFromSearchableItems(SearchableItem.get(it))}
	        	ids = booking.searchableItemsProposed.collect{it.id}
	        	ids.each{booking.removeFromSearchableItemsProposed(SearchableItem.get(it))}
	        	ids = booking.searchableItemsDenied.collect{it.id}
	        	ids.each{booking.removeFromSearchableItemsDenied(SearchableItem.get(it))}
	        }

	        bookings*.delete(flush:true,failOnError:true)
	        List items = SearchableItem.findAllByBrand(brand)
	        items.each{
	        	it.look = null
	        	it.save(flush:true,failOnError:true)
	        }
	        items*.delete(flush:true,failOnError:true)

	        items = BrandCollection.findAllByBrand(brand)
	        items*.delete(flush:true,failOnError:true)

	        brand.delete(flush:true,failOnError:true)
    	}
        render "done with " + brand.name
        return
        
    }





}