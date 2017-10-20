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

    def removeBrand() {
    	Brand.withTransaction { status ->
    		
    	
    		Brand brand = Brand.findByNameIlike("Aloura London")//Add name here to enable
	    	PRAgency agency = PRAgency.findByBrand(brand)
	    	if(agency){
	    		agency.removeFromBrands(brand)
	    		agency.save(flush:true,failOnError:true)
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
	        items*.delete(flush:true,failOnError:true)

	        brand.delete(flush:true,failOnError:true)
    	}
        render "done"
        return
        
    }





}