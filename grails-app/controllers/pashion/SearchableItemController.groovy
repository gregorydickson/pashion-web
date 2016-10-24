package pashion

import static org.springframework.http.HttpStatus.*
import grails.transaction.Transactional
import grails.converters.JSON
import java.text.SimpleDateFormat

@Transactional(readOnly = true)
class SearchableItemController {

    
    def filterSearch(){
        long startTime = System.currentTimeMillis()
        String dateFormatString = "yyyy-MM-dd"
        SimpleDateFormat dateFormat =  new SimpleDateFormat(dateFormatString)
        Date availableFrom = null
        Date availableTo = null
        Brand brand = null
        SearchableItemType type = null
        Season season = null
        def keywords = null

        log.info "params itemType:"+params.itemType
        if(params.itemType != "")
            type = SearchableItemType.findByDisplay(params.itemType)

        log.info "params brand:"+params.brand
        if(params.brand != "")
            brand = Brand.get(params.brand)
        
        log.info "params season:"+params.season
        if(params.season != "")
            season = Season.findByName(URLDecoder.decode(params.season))
        
        log.info "params availableFrom:"+params.availableFrom
        if(params.availableFrom != "" )
            availableFrom = dateFormat.parse(params.availableFrom)

        log.info "params availableTo:"+params.availableTo
        if(params.availableTo != "")   
            availableTo = dateFormat.parse(params.availableTo)
        
        log.info "params keywords:"+params.keywords
        if(params.searchtext != null && params.searchtext != ""){
            keywords = URLDecoder.decode(params.searchtext)
            keywords = keywords.split(" ")
        }
        
        log.info "Brand:"+brand
        log.info "keywords:"+keywords
        log.info "season:"+season
        log.info "type:"+type
        log.info "availableFrom:"+availableFrom
        log.info "availableTo:"+ availableTo
        def criteria = SearchableItem.createCriteria()
        
        List results = criteria.listDistinct () {
                isNotNull('image')
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
        log.info "result size:"+resultsSize 
        Integer rows = resultsSize/5
        
        if(results.size() % 5)
            rows = rows + 1
        List resultList = []
        log.info "rows:"+rows
        
        def j = 0
        for(def i=1; i<=rows; i++){

            def arow = [:]
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

    def index(Integer max) {
        long startTime = System.currentTimeMillis()
        log.info "searchable Index"
        params.max = Math.min(max ?: 1000, 5000)
        respond SearchableItem.list()
        long endTime = System.currentTimeMillis()
        long duration = (endTime - startTime)
        log.info "search duration:"+duration
    }

    @Transactional
    def savejson(){
        def jsonObject = request.JSON
        log.info "json:"+jsonObject

        def item =  SearchableItem.get(jsonObject.id)
        item.name = jsonObject.name
        item.description = jsonObject.description
        
        jsonObject.samples.each{
            
        } 
        item.save(failOnError : true, flush: true)
        def sent = [message:'Sample Request Sent']
        render sent as JSON

    }



    def show(SearchableItem searchableItem) {
        log.info "SHOW"
        respond searchableItem
    }

    def create() {
        respond new SearchableItem(params)
    }

    


    @Transactional
    def save(SearchableItem searchableItem) {
        if (searchableItem == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        if (searchableItem.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond searchableItem.errors, view:'create'
            return
        }

        searchableItem.save flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.created.message', args: [message(code: 'searchableItem.label', default: 'SearchableItem'), searchableItem.id])
                redirect searchableItem
            }
            '*' { respond searchableItem, [status: CREATED] }
        }
    }

    def edit(SearchableItem searchableItem) {
        respond searchableItem
    }

    @Transactional
    def update(SearchableItem searchableItem) {
        if (searchableItem == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        if (searchableItem.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond searchableItem.errors, view:'edit'
            return
        }

        searchableItem.save flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.updated.message', args: [message(code: 'searchableItem.label', default: 'SearchableItem'), searchableItem.id])
                redirect searchableItem
            }
            '*'{ respond searchableItem, [status: OK] }
        }
    }

    @Transactional
    def delete(SearchableItem searchableItem) {

        if (searchableItem == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        searchableItem.delete flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.deleted.message', args: [message(code: 'searchableItem.label', default: 'SearchableItem'), searchableItem.id])
                redirect action:"index", method:"GET"
            }
            '*'{ render status: NO_CONTENT }
        }
    }

    protected void notFound() {
        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.not.found.message', args: [message(code: 'searchableItem.label', default: 'SearchableItem'), params.id])
                redirect action: "index", method: "GET"
            }
            '*'{ render status: NOT_FOUND }
        }
    }
}
