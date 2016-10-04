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

    def index(){
         def daStuff = SearchableItem.list() as JSON
         render daStuff
    }
       
    def filterSearch(){
        def dateFormatString = "yyyy-MM-dd"
        def dateFormat =  new SimpleDateFormat(dateFormatString)
        Date availableFrom = null
        Date availableTo = null
        Brand brand = null
        def type = null
        if(params.itemType != "")
            type = SearchableItemType.findByDisplay(params.itemType)
        if(params.brand != "")
            brand = Brand.get(params.brand)
            
        def season = Season.findByName(URLDecoder.decode(params.season))
        
        if(params.availableFrom != "" )
            availableFrom = dateFormat.parse(params.availableFrom)
        if(params.availableTo != "")   
            availableTo = dateFormat.parse(params.availableTo)
        
        
        def keywords = URLDecoder.decode(params.searchtext)
        keywords = keywords.split(" ")
        //def items =  SearchableItem.filterResults( brand, season, itemtype, availableFrom, availableTo, keywords).list() as JSON
        def items = []
        
        def criteria = SearchableItem.createCriteria()
        def results = criteria.listDistinct () {
                if(brand) eq('brand', brand)
                if(keywords) or {
                    keywords.each {  ilike('name', '%'+it+'%') }
                }
                if(season) eq('season',season)
                if(type) eq('type',type)
                if(availableFrom && availableTo) sampleRequests{
                    and{
                        not{
                            between('bookingStartDate', availableFrom, availableTo)
                        }
                        not{
                            between('bookingEndDate', availableFrom, availableTo)
                        }
                    }
                    
                }
                if(availableFrom && availableTo) and {  
                            gt('fromDate',  availableFrom)
                            lt('toDate',  availableTo)
                }
                if(availableFrom && !availableTo) sampleRequests{
                    not{
                            between('bookingStartDate', availableFrom, availableTo)
                    }
                }
                
                

            } 
        
        log.info results
        render results as JSON
    }

    


}
