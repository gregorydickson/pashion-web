package pashion

import static org.springframework.http.HttpStatus.*
import grails.transaction.Transactional
import grails.converters.JSON
import java.text.SimpleDateFormat
import java.util.Date

import java.net.URLDecoder

@Transactional(readOnly = true)
class PashionSearchController {

         
    def filterSearch(){
        long startTime = System.currentTimeMillis()
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
        
        def items = []
        
        def criteria = SearchableItem.createCriteria()
        
        List results = criteria.listDistinct () {
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
            } 
        
        
        Integer resultsSize = results.size()
        Integer rows = resultsSize/5
        
        if(results.size() % 5)
            rows = rows + 1
        List resultList = []
        log.info "rows:"+rows
        def j = 0
        for(def i=1; i<=rows; i++){

            PashionUiRow arow = new PashionUiRow()
            if(j <= resultsSize){
                arow.numberImages = resultsSize
                arow.item1 = results[j]
                j = j + 1
            }
            if(j <= resultsSize){
                arow.item2 = results[j]
                j = j + 1
            }
            if(j <= resultsSize){
                arow.item3 = results[j]
                j = j + 1
            }
            if(j <= resultsSize){
                arow.item4 = results[j]
                j = j + 1
            }
            if(j <= resultsSize){
                arow.item5 = results[j]
                j = j + 1
            }
            resultList << arow
        }
        
        render resultList as JSON

        long endTime = System.currentTimeMillis()
        long duration = (endTime - startTime)
        log.info "search duration:"+duration
    }

    


}
