package pashion

import static org.springframework.http.HttpStatus.*
import grails.transaction.Transactional
import grails.converters.JSON

@Transactional(readOnly = true)
class AdminController {


    def removeAgencyBookings(Integer id) {
    	PRAgency agency = PRAgency.get(id)

        List bookings = SampleRequest.findAllByPrAgency(agency)
        
        bookings.each{ booking ->
        	def ids = booking.searchableItems.collect{it.id}
        	ids.each{booking.removeFromSearchableItems(SearchableItem.get(it))}
        	ids = booking.searchableItemsProposed.collect{it.id}
        	ids.each{booking.removeFromSearchableItemsProposed(SearchableItem.get(it))}
        	ids = booking.searchableItemsDenied.collect{it.id}
        	ids.each{booking.removeFromSearchableItemsDenied(SearchableItem.get(it))}
        }

        //bookings*.delete(flush:true,failOnError:true)
        render "done"
        return
        
    }


}