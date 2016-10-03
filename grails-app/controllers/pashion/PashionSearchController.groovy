package pashion

import static org.springframework.http.HttpStatus.*
import grails.transaction.Transactional
import grails.converters.JSON
import java.text.SimpleDateFormat
import java.util.Date

import java.net.URLDecoder

@Transactional(readOnly = true)
class PashionSearchController {

    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def elasticSearchService

    
       
    def filterSearch(){
        def dateFormatString = "yyyy-MM-dd"
        def dateFormat =  new SimpleDateFormat(dateFormatString)
        Date availableFrom = null
        Date availableTo = null
        Brand brand = null
        if(params.brand != "")
            brand = Brand.get(params.brand)
            
        def season = Season.findByName(URLDecoder.decode(params.season))
        def itemtype = params.itemType
        if(params.availableFrom != "")
            availableFrom = dateFormat.parse(params.availableFrom)
        if(params.availableTo != "")   
            availableTo = dateFormat.parse(params.availableTo)
        
        
        def keywords = URLDecoder.decode(params.searchtext)
        def items =  SearchableItem.filterResults( brand, season, itemtype, availableFrom, availableTo, keywords).list() as JSON
        
        render items
    }

    


}
