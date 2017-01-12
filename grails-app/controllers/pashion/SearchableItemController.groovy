package pashion

import static org.springframework.http.HttpStatus.*
import grails.transaction.Transactional
import grails.converters.JSON
import java.text.SimpleDateFormat

@Transactional(readOnly = true)
class SearchableItemController {
    
    String dateFormatString = "yyyy-MM-dd"
    
    
    def filterSearch(){
        long startTime = System.currentTimeMillis()
        SimpleDateFormat dateFormat =  new SimpleDateFormat(dateFormatString)
        Date availableFrom = null
        Date availableTo = null
        Brand brand = null
        SearchableItemType type = null
        Season season = null
        def keywords = null
        def theme = null

        if(params.itemType != null && params.itemType != "")
            type = SearchableItemType.findByDisplay(params.itemType)

        if(params.theme != null && params.theme != "")
            theme = params.theme


        if(params.brand != "" || params.brand != "All")
            brand = Brand.get(params.brand)
        

        if(params.season != "" && params.season != null)
            season = Season.findByName(URLDecoder.decode(params.season))
                   

        if(params.availableFrom != null && params.availableFrom != "" )
            availableFrom = dateFormat.parse(params.availableFrom)


        if(params.availableTo != null && params.availableTo != "")   
            availableTo = dateFormat.parse(params.availableTo)
        

        if(params.searchtext != null && params.searchtext != "" && params.searchtext != "undefined"){
            keywords = URLDecoder.decode(params.searchtext)
            keywords = keywords.split(" ")
        }
        log.info "*****************************  A SEARCH **********************"
        log.info "Brand:"+brand
        log.info "keywords:"+keywords
        log.info "season:"+season
        log.info "type:"+type
        log.info "theme:"+theme
        log.info "availableFrom:"+availableFrom
        log.info "availableTo:"+ availableTo

        def criteria = SearchableItem.createCriteria()
        
        List results = criteria.listDistinct () {

                log.info "image:"+'image'
                isNotNull('image')
                if(brand) eq('brand', brand)
                if(theme) ilike('theme', "%${theme}%")
                if(keywords) and {
                    keywords.each {  ilike('attributes', "%${it}%") }
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
                cache true
            } 

        long endTime = System.currentTimeMillis()
        long duration = (endTime - startTime)
        log.info "search duration:"+duration
        startTime = System.currentTimeMillis()

        def fixImagesPerRow = 5 
        if(fixImagesPerRow > 5) fixImagesPerRow = 5
        if(fixImagesPerRow < 3) fixImagesPerRow = 3
        
        Integer resultsSize = results.size()
        log.info "results:"+resultsSize
        
        Integer rows = resultsSize/fixImagesPerRow  
        
        if(resultsSize % fixImagesPerRow > 0)
            rows = rows + 1
        List resultList = []
        log.info "rows:"+rows
        
        def j = 0
        for(def i=1; i<=rows; i++){

            def arow = [:]
            def item = []

            arow.numberImagesThisRowPC = 100/fixImagesPerRow
            if(j < resultsSize){
                arow.numberImages = resultsSize
                arow.numberImagesThisRow = 1
                item << results[j]
                j = j + 1
            }
            if(j < resultsSize ){
                arow.numberImagesThisRow = 2
                item << results[j]
                j = j + 1
            }
            if(j < resultsSize && fixImagesPerRow >= 3){
                arow.numberImagesThisRow = 3
                item << results[j]
                j = j + 1
            }
            if(j < resultsSize && fixImagesPerRow >= 4){
                arow.numberImagesThisRow = 4
                item << results[j]
                j = j + 1
            }
            if(j < resultsSize && fixImagesPerRow >= 5) {
                arow.numberImagesThisRow = 5
                item << results[j]
                j = j + 1
            }
            arow.items = item
            resultList << arow
        }
        endTime = System.currentTimeMillis()
        duration = (endTime - startTime)
        log.info "collect results duration:"+duration
        
        startTime = System.currentTimeMillis()
        render resultList as JSON
        endTime = System.currentTimeMillis()
        duration = (endTime - startTime)
        log.info "JSON render duration:"+duration
        log.info "**************************************************************"
        
        
    }


    def browseSearch(){
        long startTime = System.currentTimeMillis()
        int maxRInt = params.maxR.toInteger()
        SimpleDateFormat dateFormat =  new SimpleDateFormat(dateFormatString)
        
        Brand brand = null

        Season season = null
        def keywords = null
        def theme = null

        if(params.theme != null && params.theme != "")
            theme = params.theme

        if(params.brand != "" || params.brand != "All")
            brand = Brand.get(params.brand)
        
        if(params.season != "")
            season = Season.findByName(URLDecoder.decode(params.season))
        

        if(params.searchtext != null && params.searchtext != "" && params.searchtext != "undefined"){
            keywords = URLDecoder.decode(params.searchtext)
            keywords = keywords.split(" ")
        }
        log.info "**************************  BROWSE SEARCH **********************"
        log.info "Brand:"+brand
        log.info "keywords:"+keywords
        log.info "season:"+season
        log.info "theme:"+theme

        def criteria = SearchableItem.createCriteria()
        
        List results = criteria.list() {

                isNotNull('image')
                if(brand) eq('brand', brand)
                if(theme) ilike('theme', "%${theme}%")
                if(keywords) and {
                    keywords.each {  ilike('attributes', "%${it}%") }
                }
                if(season) eq('season',season)
                maxResults(maxRInt)
                cache true
            } 

        long endTime = System.currentTimeMillis()
        long duration = (endTime - startTime)
        log.info "search duration:"+duration
        startTime = System.currentTimeMillis()

        def fixImagesPerRow = 5 
        if(fixImagesPerRow > 5) fixImagesPerRow = 5
        if(fixImagesPerRow < 3) fixImagesPerRow = 3
        
        Integer resultsSize = results.size()
        log.info "results:"+resultsSize
        
        Integer rows = resultsSize/fixImagesPerRow  
        
        if(resultsSize % fixImagesPerRow > 0)
            rows = rows + 1
        List resultList = []
        log.info "rows:"+rows
        
        def j = 0
        for(def i=1; i<=rows; i++){

            def arow = [:]
            def item = []

            arow.numberImagesThisRowPC = 100/fixImagesPerRow
            if(j < resultsSize){
                arow.numberImages = resultsSize
                arow.numberImagesThisRow = 1
                item << results[j]
                j = j + 1
            }
            if(j < resultsSize ){
                arow.numberImagesThisRow = 2
                item << results[j]
                j = j + 1
            }
            if(j < resultsSize && fixImagesPerRow >= 3){
                arow.numberImagesThisRow = 3
                item << results[j]
                j = j + 1
            }
            if(j < resultsSize && fixImagesPerRow >= 4){
                arow.numberImagesThisRow = 4
                item << results[j]
                j = j + 1
            }
            if(j < resultsSize && fixImagesPerRow >= 5) {
                arow.numberImagesThisRow = 5
                item << results[j]
                j = j + 1
            }
            arow.items = item
            resultList << arow
        }
        endTime = System.currentTimeMillis()
        duration = (endTime - startTime)
        log.info "collect results duration:"+duration
        
        startTime = System.currentTimeMillis()
        render resultList as JSON
        endTime = System.currentTimeMillis()
        duration = (endTime - startTime)
        log.info "JSON render duration:"+duration
        log.info "**************************************************************"
        
        
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
    def saveFromDate(){
        def jsonObject = request.JSON
        log.info "json:"+jsonObject
        SimpleDateFormat dateFormat =  new SimpleDateFormat(dateFormatString)
        def item =  SearchableItem.get(jsonObject.id)
        item.fromDate = dateFormat.parse(jsonObject.fromDate)
        item.save(failOnError : true, flush: true)
        def sent = [message:'Items Updated']
        render sent as JSON

    }
    

    @Transactional
    def savejson(){
        def jsonObject = request.JSON
        log.info "json:"+jsonObject

        def item =  SearchableItem.get(jsonObject.id)
        item.name = jsonObject.name
        item.description = jsonObject.description
        
        jsonObject.samples.each{
            def sample = SearchableItem.get(it.id)
            if(!sample){
                sample = new SearchableItem()
                sample.look = item
                sample.season = item.season
                sample.brandCollection = item.brandCollection
                sample.material = item.material
                sample.brand = item.brand
                sample.type = SearchableItemType.get(2)
            }
            sample.sampleType = it.sampleType
            sample.color = it.color
            sample.name = it.name
            sample.description = it.description

            sample.save(failOnError : true, flush: true)
        } 
        item.save(failOnError : true, flush: true)
        def sent = [message:'Items Updated']
        render sent as JSON

    }

    def fetchdeep(){
        def item = SearchableItem.findById(params.id.toInteger(),[fetch:[brandCollection:"join"]])
        respond item
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
