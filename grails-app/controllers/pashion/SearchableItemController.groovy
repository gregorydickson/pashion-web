package pashion

import static org.springframework.http.HttpStatus.*
import grails.transaction.Transactional
import grails.converters.JSON
import java.text.SimpleDateFormat
import org.springframework.web.multipart.MultipartFile
import org.hibernate.criterion.CriteriaSpecification
import static org.hibernate.sql.JoinType.*
import org.hibernate.FetchMode as FM

@Transactional(readOnly = false)
class SearchableItemController {
    static scope = "session"
    
    // String dateFormatString = "yyyy-MM-dd"
    String dateFormatString = "dd-MMM-yyyy"
    def amazonS3Service
    
    def brandSearch(){
        long startTime = System.currentTimeMillis()
        SimpleDateFormat dateFormat =  new SimpleDateFormat(dateFormatString)
        
        Brand brand = null
        SearchableItemType type = null
        Season season = null
        City city = null
        List results = null
        def keywords = null
        def criteria = SearchableItem.createCriteria()

        
        if(params.brand && params.brand != '' && params.brand.trim() != 'All'){
            brand = Brand.get(params.brand.trim())
        }
        
        if(params.season != "" && params.season != null)
            season = Season.findByName(URLDecoder.decode(params.season))

        if(params.searchtext != null && params.searchtext != "" && params.searchtext != "undefined"){
            keywords = URLDecoder.decode(params.searchtext)
            keywords = keywords.split(" ")
        }

        if(params.city != null && params.city != "" && params.city != "All" && params.city != "undefined"){
            city = City.findByName(URLDecoder.decode(params.city))

            type = SearchableItemType.findByDisplay("Samples")
            log.info "*****************************  A BRAND CITY SEARCH **********************"
            log.info "Brand:"+brand
            log.info "keywords:"+keywords
            log.info "season:"+season
            log.info "type:"+type
            
            log.info "city:"+ params.city + " (" + city + ")"

            
            //find Samples in city
            results = criteria.listDistinct () {
                    
                    if(brand) eq('brand', brand)

                    if(keywords) and {
                        keywords.each {  ilike('attributes', "%${it}%") }
                    }
                    if(season) eq('season',season)
                    if(type) eq('type',type)
                    if(city) eq('sampleCity',city)
                    
                    
                    cache true
            } 
            log.info "brand results count:"+results.size()
            def ids = []
            results.collect{ids << it.look.id }
            ids.unique()
            if(ids.size()>0){
                results = SearchableItem.findAllByIdInList(ids)
            } else{
                results = []
            }
        } else{
            log.info "*****************************  A BRAND NON-CITY SEARCH **********************"
            log.info "Brand:"+brand
            log.info "keywords:"+keywords
            log.info "season:"+season
            log.info "type:"+type

            results = criteria.listDistinct () {
                isNotNull('image')
                if(brand) eq('brand', brand)
                if(keywords) and {
                    keywords.each {  ilike('attributes', "%${it}%") }
                }
                if(season) eq('season',season)
                cache true
            } 

        }

        long endTime = System.currentTimeMillis()
        long duration = (endTime - startTime)
        log.info "search duration:"+duration
        startTime = System.currentTimeMillis()
        
        def resultList = collectItems(results)

        endTime = System.currentTimeMillis()
        duration = (endTime - startTime)
        log.info "collect results duration:"+duration
        
        startTime = System.currentTimeMillis()
        def jsonList = resultList as JSON
        render jsonList
        endTime = System.currentTimeMillis()
        duration = (endTime - startTime)
        log.info "JSON render duration:"+duration
        log.info "**************************************************************"
        

    }
    def filterSearch(){
        long startTime = System.currentTimeMillis()
        log.info "**********************  A Press availability SEARCH **********************"
        SimpleDateFormat dateFormat =  new SimpleDateFormat(dateFormatString)
        dateFormat.setTimeZone(TimeZone.getTimeZone("UTC"))
        Date availableFrom = null
        Date availableTo = null
        Brand brand = null
        SearchableItemType type = null
        Season season = null
        def keywords = null
        def theme = null
        def color = null
        City city = null

        Integer maxRInt = params.maxR.toInteger()
        if(!maxRInt) maxRInt = 2000

        if(params.itemType != null && params.itemType != "")
            type = SearchableItemType.findByDisplay(params.itemType)

        if(params.theme != null && params.theme != "")
            theme = params.theme

        if(params.color != null && params.color != "")
            color = params.color

        if(params.city != null && params.city != "")
            city = City.findByName(URLDecoder.decode(params.city))

        log.debug "brand param:"+params.brand
        if(params.brand && params.brand != '' && params.brand.trim() != 'All'){
            brand = Brand.get(params.brand.trim())
        }

        if(params.season != "" && params.season != null)
            season = Season.findByName(URLDecoder.decode(params.season))
                   
        log.debug "availableFrom param:"+params.availableFrom
        if(params.availableFrom != null && params.availableFrom != "" )
            availableFrom = dateFormat.parse(params.availableFrom)

        log.debug "availableTo param:"+params.availableTo
        if(params.availableTo != null && params.availableTo != "")   
            availableTo = dateFormat.parse(params.availableTo)
        
        if(params.searchtext != null && params.searchtext != "" && params.searchtext != "undefined"){
            keywords = URLDecoder.decode(params.searchtext)
            keywords = keywords.split(" ")
        }
        
        log.info "Brand:"+brand
        log.info "keywords:"+keywords
        log.info "season:"+season
        log.info "type:"+type
        log.info "theme:"+theme
        log.info "availableFrom:"+availableFrom
        log.info "availableTo:"+ availableTo
        log.info "city param:"+ params.city
        log.info "city:" + city
        log.info "color:"+color

        def criteria = SearchableItem.createCriteria()
        
        
        List results = criteria.listDistinct () {
            fetchMode 'brand', FM.JOIN
            fetchMode 'samples', FM.JOIN
            fetchMode 'samples.sampleRequests', FM.JOIN
            
            isNotNull('image')
            eq('isPrivate',false)
            if(brand) eq('brand', brand)
            if(theme) ilike('attributes', "%${theme}%")
            if(keywords) and {
                keywords.each {  ilike('attributes', "%${it}%") }
            }
            if(season) eq('season',season)
            if(type) eq('type',type)
            if(city) eq('city',city)
            if(color) ilike('color',"%${color}%")
               
            maxResults(500)
            cache true
        }

        if(availableFrom && availableTo)
            results = filterOnDates(results, availableFrom, availableTo)

        results.take(maxRInt)
        
        long endTime = System.currentTimeMillis()
        long duration = (endTime - startTime)
        log.info "search duration:"+duration
        startTime = System.currentTimeMillis()
        log.info "Number of Looks:"+results.size()
        def resultList = collectItems(results)

        endTime = System.currentTimeMillis()
        duration = (endTime - startTime)
        log.info "collect results duration:"+duration
        
        startTime = System.currentTimeMillis()
        def jsonList = resultList as JSON
        render jsonList
        endTime = System.currentTimeMillis()
        duration = (endTime - startTime)
        log.info "JSON render duration:"+duration
        log.info "**************************************************************"
        
        
    }

    def filterOnDates(results, availableFrom, availableTo){
        log.debug "availability filter"
        log.debug "availableFrom:"+availableFrom
        log.debug "availableTo:"+availableTo
        results.removeAll {
            def remove = false
            def count = 0
            it.samples.each{
                def booked = false
                it.sampleRequests.each{
                    log.debug "start date"+it.bookingStartDate
                    log.debug "end date"+it.bookingEndDate
                    if ( 
                        (
                             (it.bookingStartDate.after(availableFrom) ||
                             it.bookingStartDate.equals(availableFrom))
                             &&
                             (it.bookingStartDate.before(availableTo) ||
                             it.bookingStartDate.equals(availableTo)) 
                          ||
                             (it.bookingEndDate.after(availableFrom) ||
                             it.bookingEndDate.equals(availableFrom))
                             && 
                             (it.bookingEndDate.before(availableTo) ||
                             it.bookingEndDate.equals(availableTo))
                        )
                        &&
                        (it.requestStatusBrand == 'Approved' ||
                        it.requestStatusBrand == 'Picked Up' ||
                        it.requestStatusBrand == 'Returning')
                    ){
                        log.debug "booked true"
                        booked = true
                    }
                }       
                if(booked) ++count     
            }
            log.debug "count:"+count
            log.debug "samples size:"+it.samples.size()
            if(count == it.samples.size() && !(it.brand.hideCalendar)) {
                log.debug "removing"
                remove = true
            }
            remove
        }
        log.info "filtered results:"+results.size()

        results
    }

    def collectItems(results){
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
        resultList
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
        log.info "fromdate:"+jsonObject.fromDate
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
        log.info "save item:"+jsonObject

        def item =  SearchableItem.get(jsonObject.id)
        item.name = jsonObject.name
        item.description = jsonObject.description
        item.attributes = jsonObject.attributes
        
        jsonObject.samples.each{
            
            def sample = SearchableItem.get(it.id)
            if(!sample){
                sample = new SearchableItem()
                sample.look = item
                sample.season = item.season
                sample.brandCollection = item.brandCollection

                sample.brand = item.brand
                sample.type = SearchableItemType.get(2)
            }
            sample.clientID = it.clientID
            sample.sampleType = it.sampleType
            sample.color = it.color
            sample.name = it.name
            sample.size = it.size
            sample.material = it.material
            sample.sampleCity = City.get(it.sampleCity?.id?.toInteger())
            
            sample.description = it.description
            sample.attributes = it.attributes
            sample.material = it.material

            sample.save(failOnError : true, flush: true)
        } 
        item.save(failOnError : true, flush: true)
        def sent = [message:'Items Updated']
        render sent as JSON

    }

    def fetchdeep(){
        def item = SearchableItem.findById(params.id.toInteger(),[fetch:[brandCollection:"join",cache:true]])
        respond item
    }

    @Transactional
    def upload(){
        log.info "upload params:"+params
        def user = session.user
        
        log.info "user:"+user

        Brand brand = user.brand
        log.info "brand:"+brand
        Season season = Season.findOrSaveWhere(name:params.season.toString().trim()).save()
        log.info "season:"+season
        BrandCollection brandCollection = BrandCollection.findOrSaveWhere(brand:brand,season:season).save()
        SearchableItemType type = SearchableItemType.findByDisplay('Looks')
        String path = brand.name.toLowerCase().replace(" ","-")+"/"+season.name.toLowerCase().replace(" ","-") +"/"
        log.info "path:"+path
        SearchableItem item = null
        def all = request.getFileNames()
        all.each{String name ->
            log.info "file:"+name
            try{
               log.info "try block"
               item = new SearchableItem()
               log.info "created item"
               if(params.isPrivate){
                    item.isPrivate = true
                }
               item.type = type
               item.brand = brand
               log.info "brand"
               item.brandCollection = brandCollection
               item.season = season
               log.info "season"
               def imageString = "//dvch4zq3tq7l4.cloudfront.net/" + path + name
               log.info "image string:"+imageString
               item.image = imageString
               MultipartFile multipartFile = request.getFile(name)
               log.info "file:"+multipartFile
               
               String location = path + name
               log.info "location:"+location
               String message

               if (multipartFile && !multipartFile.empty) {
                    log.info "storing"
                    message = amazonS3Service.storeMultipartFile("pashion-tool", location, multipartFile)
                    log.info "store message:"+message
               }
               if(message){
                    item.save(failOnError:true)
               }
              
            } catch(Exception e){
                log.error "exception saving file:"+e.message
            }
        }

        def sent = [message:'Items Updated']
        render sent as JSON

    }



    def show(SearchableItem searchableItem) {
        log.info "show"
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
