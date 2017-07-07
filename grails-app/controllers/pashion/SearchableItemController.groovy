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
        
        Brand brandIn = null
        SearchableItemType type = null
        Season seasonIn = null
        Category category = null
        City city = null
        Date availableFrom = null
        Date availableTo = null
        List results = null
        def keywords = null
        def criteria = SearchableItem.createCriteria()
        def outToday = null;

              
        if(params.brand && params.brand != '' && params.brand.trim() != 'All' && params.brand.trim() != 'ALL'){
            brandIn = Brand.get(params.brand.trim())
        }
        //log.info "brand param:"+params.brand  + " after " + brand
        
        if(params.season && params.season != "" && params.season != null)
            seasonIn = Season.findByName(URLDecoder.decode(params.season))

        if(params.searchtext && params.searchtext != null && params.searchtext != "" && params.searchtext != "undefined"){
            keywords = URLDecoder.decode(params.searchtext)
            keywords = keywords.split(" ")
        }

        if (params.category && params.category != "" && params.category != null)
            category = Category.findById(params.category)

        if (params.city && params.city != "" && params.city != null && params.city != "All" && params.city != "ALL" && params.city != "undefined") 
            city = City.get(params.city.toInteger())

        if (params.availableFrom && params.availableFrom != null && params.availableFrom != "" )
            availableFrom = dateFormat.parse(params.availableFrom)

        if (params.availableTo && params.availableTo != null && params.availableTo != "")   
            availableTo = dateFormat.parse(params.availableTo)

        if (params.outToday && params.outToday != null && params.outToday != "") 
            outToday = Boolean.parseBoolean(params.outToday);

        if ((city != null ) || 
           (keywords != null) ||
           (availableTo != null) ||
           (outToday != null)){


            type = SearchableItemType.findByDisplay("Samples")
            log.info "*****************************  A BRAND search with city OR keyword OR outToday or availbleDates. IE search all itmes and cascades up to the look"
            log.info "Brand:"+brandIn
            log.info "keywords:"+keywords
            log.info "season:"+seasonIn
            log.info "category:"+category
            log.info "availableFrom:"+availableFrom
            log.info "availableTo:"+ availableTo
            log.info "out today:" + outToday            
            log.info "city:"+ params.city + " (" + city + ")"
            log.info "type to match:"+ type

            results = criteria.listDistinct () {
                fetchMode 'brandCollection', FM.JOIN
                fetchMode 'samples', FM.JOIN
                fetchMode 'samples.sampleRequests', FM.JOIN
                fetchMode 'brand', FM.JOIN

                    if(brandIn) eq('brand', brandIn)

                    // only need keywords to search all items
                    if(keywords) and {            
                        or {
                            keywords.each { ilike('attributes', "%${it}%") }
                            keywords.each { ilike('message', "%${it}%") }
                        }
                    } 

                    if(type) eq('type',type)
                    /*
                    if(!keywords) {
                        // otherwise restrict to looks
                        isNotNull('image')
                        log.info "type all"
                    } else {
                        

                        log.info "type to match:"+ type
                    }
                    */

                    if(seasonIn) eq('season',seasonIn)
                    
                    if(city) eq('sampleCity',city)
                    if(category) brandCollection {
                        eq('category',category)
                    }

                    season { order('order','desc') }

                    brand { order ('name', 'asc')}

                    order ('name', 'asc')
                    
                    cache true
            }

            log.info "Results from search: " + results.size()

            def ids = []
            results.collect{ids << it.look.id }
            ids.unique()
            if(ids.size()>0){
                results = SearchableItem.getAll(ids)
                log.info "Results from collection: " + results.size()
            } else {
                results = []
            }

            if ((availableFrom && availableTo) || outToday) {
                if (outToday) results = filterOnDates(results, availableFrom, availableTo, outToday, true)
                else results = filterOnDates(results, availableFrom, availableTo, outToday, true)
            }

        } else {
            // Doesn't match on search outside of attributes
            log.info "*****************************  A BRAND search with NO city AND NO keyword. IE looks only (IE SI's with images)"
            log.info "Brand:"+brandIn
            log.info "NO keywords!" // +keywords
            log.info "season:"+seasonIn
            log.info "category:"+category
            log.info "type:"+type
            log.info "NO city!"


            results = criteria.listDistinct () {
                fetchMode 'brandCollection', FM.JOIN

                isNotNull('image')
                if(brandIn) eq('brand', brandIn)
             /*  if(keywords) and {
                    keywords.each {  
                             ilike('message', "%${it}%") 
                     }
                } */
                if(seasonIn) eq('season',seasonIn)
                if(category) brandCollection {
                        eq('category',category)
                    }
                season { order('order','desc') }

                brand { order ('name', 'asc')}

                order ('name', 'asc')

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
        Brand brandIn = null
        SearchableItemType type = null
        Season seasonIn = null
        Category category = null
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
            brandIn = Brand.get(params.brand.trim())
        }

        if(params.season != "" && params.season != null)
            seasonIn = Season.findByName(URLDecoder.decode(params.season))

        if(params.category != "" && params.category != null)
            category = Category.findById(params.category)
                   
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
        
        log.info "Brand:"+brandIn
        log.info "keywords:"+keywords
        log.info "season:"+seasonIn
        log.info "category:"+category
        log.info "type:"+type
        log.info "theme:"+theme
        log.info "availableFrom:"+availableFrom
        log.info "availableTo:"+ availableTo
        log.info "city param:"+ params.city
        log.info "city:" + city
        log.info "color:"+color
        //log.info "MaxR (1000 fetched): "+maxRInt

        def criteria = SearchableItem.createCriteria()
        
        
        List results = criteria.listDistinct () {
            fetchMode 'brand', FM.JOIN
            fetchMode 'samples', FM.JOIN
            fetchMode 'samples.sampleRequests', FM.JOIN
            fetchMode 'brandCollection', FM.JOIN
            
            isNotNull('image')
            eq('isPrivate',false)
            if(brandIn) eq('brand', brandIn)
            if(theme) ilike('attributes', "%${theme}%")
            if(keywords) and {
                keywords.each {  ilike('attributes', "%${it}%") }
            }
            if(seasonIn) eq('season',seasonIn)
            if(category) brandCollection {
                eq('category',category)
            }
            if(type) eq('type',type)
            if(city) eq('city',city)
            if(color) ilike('color',"%${color}%")


            season { order('order','desc') }

            brand { order ('name', 'asc')}

            order ('name', 'asc')

            setMaxResults(1000)
            cache true
        }

        log.info "Results from search: " + results.size()
        if(availableFrom && availableTo)
            results = filterOnDates(results, availableFrom, availableTo, false, false)

        results = results.take(maxRInt)
        
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

    // checks for complete un-availability for the looks (IE all samples are booked) in results
    // if outToday == false, same behavior
    // if outToday == true, then flips and returns all completely booked looks
    // partial returns results with any smaple out or in as appropriate
    def filterOnDates(results, availableFrom, availableTo, outToday, partial){
        SimpleDateFormat dateFormat =  new SimpleDateFormat(dateFormatString)
        log.info "availability filter"
        log.info "availableFrom:"+availableFrom
        log.info "availableTo:"+availableTo
        log.info "results: " + results.size()
        log.info "outToday: " + outToday
        log.info "partial: " + partial
        results.removeAll {
            def remove = false
            if (outToday) remove = true
            def count = 0
            def unCount = 0
            it.samples.each{
                def booked = false
                if (it.outReason && it.outReason.id != 0) {
                    //log.info "outReason true";
                    booked = true;
                } else {
                    //log.info "id: " + it.look.name
                    it.sampleRequests.each{
                      //log.info "--- " + it.id 
                      //if (it.id == 503) {
                            //log.info "start date for booking:" +it.bookingStartDate
                            //log.info "end date for booking:"+it.bookingEndDate
                            
                        //      }
                        if ( 
                                ((
                                     (it.bookingStartDate.after(availableFrom) ||
                                        dateFormat.format(it.bookingStartDate).equals(dateFormat.format(availableFrom)))
                                     &&
                                     (it.bookingStartDate.before(availableTo) ||
                                        dateFormat.format(it.bookingStartDate).equals(dateFormat.format(availableTo)))
                                ) 
                                  ||
                                (
                                     (it.bookingEndDate.after(availableFrom) ||
                                        dateFormat.format(it.bookingEndDate).equals(dateFormat.format(availableFrom)))
                                     && 
                                     (it.bookingEndDate.before(availableTo) ||
                                        dateFormat.format(it.bookingEndDate).equals(dateFormat.format(availableTo)))
                                )
                                ||
                                (
                                     (it.bookingStartDate.before(availableFrom) ||
                                        dateFormat.format(it.bookingStartDate).equals(dateFormat.format(availableFrom)))
                                     && 
                                     (it.bookingEndDate.after(availableTo) ||
                                        dateFormat.format(it.bookingEndDate).equals(dateFormat.format(availableTo)))
                                ))
                            &&
                                (it.requestStatusBrand == 'Approved' ||
                                it.requestStatusBrand == 'Picked Up' ||
                                it.requestStatusBrand == 'Returning')
                            )
                        {
                            //log.info "booked true";
                            booked = true;
                        }
                    }  
                }     
                if(booked) ++count   
                else ++unCount 
            }
            //log.info "count:"+count + " unCount:"+unCount + " it.samples.size():" + it.samples.size() // + " it.samples.sampleRequests.size():" + it.samples.sampleRequests.size()
            //if ( it.samples.size() !=0 ) log.info "samples size for:" + it.id + " : " +it.samples.size()
            if ((count == it.samples.size()) && !(it.brand.hideCalendar)) {
                //log.info "removing"
                remove = true
                if (outToday) {
                   //log.info "...undo removing for OUT"
                    remove = false
                }
            } else if ((unCount != it.samples.size()) && !(it.brand.hideCalendar) && partial && outToday) {
                //log.info "removing partials for OUT"
                remove = false
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
        log.info "save item using savejson:"+jsonObject

        def item =  SearchableItem.get(jsonObject.id)
        item.name = jsonObject.name
        item.description = jsonObject.description
        item.attributes = jsonObject.attributes
        item.isPrivate = jsonObject.isPrivate
        jsonObject.deletedSamples.each{
            def sample = SearchableItem.get(it)
            sample.delete(failOnError:true, flush: true)
        }
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
            log.info "outreason:"+it.outReason
            if (it.outReason) sample.outReason = OutReason.get(it.outReason.id.toInteger())
            
            sample.description = it.description
            sample.attributes = it.attributes
            sample.material = it.material
            sample.isPrivate = it.isPrivate

            sample.message = it.message

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
        def sent
        def user = session.user
        
        log.info "user:"+user

        Brand brand = user.brand
        log.info "brand:"+brand

        Long seasonp = params.season.toInteger()
        log.info "season in params:"+seasonp

        Long categoryp = params.category.toInteger()
        log.info "category in params:"+categoryp

        Season season = Season.findOrSaveWhere(id:seasonp).save(failOnError:true, flush:true)
        log.info "season:"+season

        Category category = Category.findOrSaveWhere(id:categoryp).save(failOnError:true, flush:true)
        log.info "category:"+category

        BrandCollection brandCollection = BrandCollection.findOrSaveWhere(brand:brand,season:season).save(failOnError:true, flush:true)

        SearchableItemType type = SearchableItemType.findByDisplay('Looks')
        log.info "type:" + type

        //String path = brand.name.toLowerCase().replace(" ","-")+"/"+season.name.toLowerCase().replace(" ","-") +"/"
        String path = brand.name.toLowerCase().replace(" ","-")+"/"+season.path+"/"+category.path+"/"
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
               Boolean fileExists = amazonS3Service.exists("pashion-tool", location)
               if (fileExists) {
                    log.info "file already exists"
                    response.status = 501
                    //response.statusText = 'File ' + name + ' Already Exists'
                    //sent = [message: 'File ' + name + ' Already Exists', error: true]
                    //render sent as JSON 
                    return
               }

               /* file size exception comes from spring, so no need to do this.
               /* and up proven code
               Integer fileSize = multipartFile.getBytes()
               log.info "file size:" + fileSize
                if (fileSize > 2000000){
                    log.info "file too big"
                    response.status = 500
                    sent = [message: 'File ' + name + ' Bigger than 2MB ', error: true]
                    render sent as JSON 
                    return
               }
               */


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
                response.status = 502
                //sent = [message: 'Error Saving File', error: true]
                //render sent as JSON 
                return
            }
        }

        sent = [message:'Items Updated', error: false]
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
        log.info "deleting:" + searchableItem.name

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


    def pad(){
        SearchableItemType type = SearchableItemType.findByDisplay('Looks')
        def ids = SearchableItem.executeQuery('select id from SearchableItem')
        for (id in ids) {
            SearchableItem.withTransaction { status ->
                
                def item = SearchableItem.get(id)
                if(item.type == type){
                    try{
                        if(item.name.toInteger() < 10){
                            log.info "updating"+item.name
                            item.name = item.name.trim().padLeft(2,'0')
                            log.info "new name:"+ item.name
                            item.save(failOnError:true, flush:true)
                            log.info "updated"
                        }
                    } catch(Exception e){
                        log.info "exception"+e.message
                    }
                }
            }

        }
        log.info "done"
        render 'done'
        
    }
}
