package pashion

import grails.transaction.Transactional
import org.grails.web.json.JSONObject
import java.text.SimpleDateFormat
import org.hibernate.FetchMode as FM

@Transactional
class SampleRequestService {

    String dateFormatString = "yyyy-M-d"
    String dateTimeFormatString = "yyyy-MMM-dd HH:mm"
    String dateTimeMonthFormatString = "yyyy-MMM-dd HH:mm"
    def cacheInvalidationService

    def listByUserOrganization(User user) {
    	def criteria = SampleRequest.createCriteria()
        List results = []

        if(user?.brand)
        {
            def brand = user.brand
            results = criteria.listDistinct () {
                fetchMode 'brand', FM.JOIN
                fetchMode 'pressHouse', FM.JOIN
                fetchMode 'searchableItemsProposed', FM.JOIN 
                fetchMode 'shippingOut', FM.JOIN
                fetchMode 'shippingReturn', FM.JOIN
                fetchMode 'addressDestination', FM.JOIN
                fetchMode 'returnToAddress', FM.JOIN
                fetchMode 'requestingUser', FM.JOIN
                fetchMode 'deliverTo', FM.JOIN
                fetchMode 'returnToAddress', FM.JOIN

                eq('brand', brand)
                cache true
            }
        }
        if(user?.pressHouse){
            def pressHouse = user.pressHouse
            results = criteria.listDistinct () {
                fetchMode 'brand', FM.JOIN
                fetchMode 'pressHouse', FM.JOIN
                fetchMode 'searchableItemsProposed', FM.JOIN 
                fetchMode 'shippingOut', FM.JOIN
                fetchMode 'shippingReturn', FM.JOIN
                fetchMode 'addressDestination', FM.JOIN
                fetchMode 'returnToAddress', FM.JOIN
                fetchMode 'requestingUser', FM.JOIN
                fetchMode 'deliverTo', FM.JOIN
                fetchMode 'returnToAddress', FM.JOIN

                eq('pressHouse', pressHouse)
                cache true
            }
        }
        if(user?.prAgency){

            def agency = PRAgency.get(user.prAgency.id)
            
            def agencyCriteria = SampleRequest.createCriteria()
            results = agencyCriteria.listDistinct () {
                fetchMode 'prAgency', FM.JOIN
                fetchMode 'searchableItemsProposed', FM.JOIN 
                fetchMode 'shippingOut', FM.JOIN
                fetchMode 'shippingReturn', FM.JOIN
                fetchMode 'addressDestination', FM.JOIN
                fetchMode 'returnToAddress', FM.JOIN
                fetchMode 'requestingUser', FM.JOIN
                fetchMode 'deliverTo', FM.JOIN
                fetchMode 'returnToAddress', FM.JOIN

                eq('prAgency', agency)
                cache true
            }
        }
        results
    }

    // TROLLEY SPECIFIC METHODS

    /*
    *  This method is to save items in the trolley during picking.
    *  It may be used to save and update current trolley items.
    *  So there may be an existing sample request or a new one
    *  may need to be created. In other words this is save and update.
    */
    def saveTrolley(JSONObject jsonObject, User user){
        SimpleDateFormat dateFormat =  new SimpleDateFormat(dateFormatString)
        def sr = null
        if(jsonObject.id){
            sr = SampleRequest.get(jsonObject.id.toInteger())
            
            def ids = sr.searchableItemsProposed.collect{it.id}
            ids.each{sr.removeFromSearchableItemsProposed(SearchableItem.get(it))}

            jsonObject.searchableItemsProposed.each{
                def item = SearchableItem.get(it.id)
                sr.addToSearchableItemsProposed(item)
            }

        } else{
            sr = new SampleRequest()
            sr.datesSaved = true
            if(user.prAgency) sr.prAgency = PRAgency.get(user.prAgency.id)
            if(user.brand) sr.brand = Brand.get(user.brand.id)
            sr.bookingStartDate = dateFormat.parse(jsonObject.startDate)
            sr.bookingEndDate = dateFormat.parse(jsonObject.endDate)
            jsonObject.searchableItemsProposed.each{
                def item = SearchableItem.get(it.id)
                sr.addToSearchableItemsProposed(item)
            }
        }
        sr.startDay = jsonObject.startDay
        sr.startDate = jsonObject.startDate
        sr.startMonth = jsonObject.startMonth
        sr.endDay = jsonObject.endDay
        sr.endDate = jsonObject.endDate
        sr.endDay = jsonObject.endDay
        sr.endMonth = jsonObject.endMonth
        sr.startOffset = jsonObject.startOffset
        sr.endOffset = jsonObject.endOffset

        if(jsonObject.requestStatusBrand){
            log.info "status set client side to:"+jsonObject.requestStatusBrand
            sr.requestStatusBrand = jsonObject.requestStatusBrand
        } else{
            sr.requestStatusBrand = "Not Submitted"
            sr.requestStatusPress = "Not Submitted"
        }
        sr.save(failOnError:true, flush:true)
        log.info "sample request trolly saved:"+sr
        sr
    }

    /*
    * This is saving the trolleys address information, the second step in the process after
    * picking. May also remove samples to they have to be updated.
    */
    def updateTrolley(JSONObject jsonObject, User user){
        SimpleDateFormat dateFormat =  new SimpleDateFormat(dateFormatString)
        def sr = null
        log.info "update Trolley:"+jsonObject.id
        
        
        sr = SampleRequest.get(jsonObject.id.toInteger())

        def ids = sr.searchableItemsProposed.collect{it.id}
        ids.each{sr.removeFromSearchableItemsProposed(SearchableItem.get(it))}

        jsonObject.searchableItemsProposed.each{ sample ->
            def item = SearchableItem.get(sample.id)
            sr.addToSearchableItemsProposed(item)
            def status = sr.searchableItemsStatus.find { it.id == sample.id }
            if(!status){
                status = new BookingStatus()
                status.itemId = sample.id
                status.status = "Approved"
                sr.addToSearchableItemsStatus(status)
            }
        
        }

        if(jsonObject.emailNotification)
            sr.emailNotification = jsonObject.emailNotification

        if(jsonObject.message)
            sr.message = jsonObject.message
        
        if(jsonObject.requestStatusBrand){
            sr.requestStatusBrand = jsonObject.requestStatusBrand
        } else{
            sr.requestStatusBrand = "Approved"
            sr.requestStatusPress = "Approved"
        }

        sr.requiredBy = jsonObject.requiredBy
        sr.returnBy = jsonObject.returnBy
        if(!sr.shippingOut)
            sr.shippingOut = new ShippingEvent(courier:jsonObject.courier,status:'Proposed').save(failOnError:true)
        if(!sr.shippingReturn)
            sr.shippingReturn = new ShippingEvent(status:'Proposed').save(failOnError:true)
        sr.paymentOut = jsonObject.paymentOut
        sr.paymentReturn = jsonObject.paymentReturn
        sr.courierOut = jsonObject.courierOut
        sr.courierReturn = jsonObject.courierReturn
        sr.requestingUser = user
        sr.dateRequested = new Date()
        sr = destinationAddressBrand(sr,jsonObject)
        sr = returnToAddress(sr,jsonObject)

        sr.save(failOnError:true, flush:true)
        log.info "sample request trolly submitted:"+sr
        sr
    }



    def initialSaveSampleRequest(JSONObject jsonObject, User requestingUser){
        SimpleDateFormat dateFormat =  new SimpleDateFormat(dateFormatString)
        log.info "initial save sample request:"+jsonObject
        def sr = new SampleRequest()
        
        SampleRequest.withTransaction { transactionStatus ->
            
        
            if(jsonObject.emailNotification)
                sr.emailNotification = jsonObject.emailNotification
            sr.bookingStartDate = dateFormat.parse(jsonObject.startDate)

            sr.bookingEndDate = dateFormat.parse(jsonObject.endDate)
            sr.requiredBy = jsonObject.requiredBy
            
            
            sr.returnBy = jsonObject.returnBy

            sr.requestStatusBrand = "Pending"
            sr.requestStatusPress = "Pending"
         

            SearchableItem item

            jsonObject.samples.each{
                item = SearchableItem.get(it)
                log.info "sample request item:"+item.id
                if(!sr.brand) sr.brand = item.brand
                if(!sr.image) sr.image = item.look.image
                if(!sr.season) sr.season = item.season.name
                if(item?.look?.nameNumber && (!sr.look)){
                    log.info "adding look name to sr"
                    sr.look = item?.look?.nameNumber
                    if(item?.look?.nameVariant)
                        sr.look = sr.look + item?.look?.nameVariant?.toUpperCase()
                }

                sr.addToSearchableItemsProposed(item)
                def status = new BookingStatus()
                status.itemId = item.id
                status.status = "Requested"
                
                sr.addToSearchableItemsStatus(status)
            } 
            sr.shippingOut = new ShippingEvent(courier:jsonObject.courier,status:'Proposed').save(failOnError:true)
            sr.shippingReturn = new ShippingEvent(status:'Proposed').save(failOnError:true)
            sr.paymentOut = jsonObject.paymentOut
            sr.paymentReturn = jsonObject.paymentReturn
            sr.courierOut = jsonObject.courierOut
            sr.courierReturn = jsonObject.courierReturn
            sr.requestingUser = requestingUser

            if(jsonObject.prAgency) sr.prAgency = PRAgency.get(jsonObject.prAgency)

            def srUser = User.get(requestingUser.id)
            if(srUser.brand) sr.requestingUserCompany = srUser.brand.name
            if(srUser.pressHouse) sr.requestingUserCompany = srUser.pressHouse.name
            if(srUser.prAgency) sr.requestingUserCompany = srUser.prAgency.name

            // truncate if necessary 
            if (jsonObject.message) {
                if (jsonObject.message.length() > SampleRequest.constrainedProperties.message.maxSize)
                    sr.message = jsonObject.message.take(SampleRequest.constrainedProperties.message.maxSize)
                else 
                    sr.message = jsonObject.message
            }
            
            
            sr.dateRequested = new Date()
            if(requestingUser.pressHouse){
                sr = destinationAddressPress(sr,jsonObject)
            } else {
                sr = destinationAddressBrand(sr,jsonObject)
            }
            
            sr = returnToAddress(sr,jsonObject)
            sr.save(failOnError : true, flush: true)
            log.info "SAVED SAMPLE REQUEST:"+sr.id
        }
        sr
    }


    def returnToAddress(SampleRequest sr, JSONObject jsonObject){
        if(jsonObject.has('returnToAddress')){
            log.info "returnTo Address:"+jsonObject.returnToAddress
            def returnToAddress = jsonObject.returnToAddress
            log.info ""
            if(returnToAddress == '0'){

                sr.returnToAddress = Address.findByBrandAndDefaultAddress(sr.brand, true)
                log.info "return to brand default"+sr.returnToAddress
            } else if(returnToAddress instanceof Integer){
                sr.returnToAddress = Address.get(jsonObject.returnToAddress)
            } else if(returnToAddress instanceof String){
                sr.returnToAddress = Address.get(jsonObject.returnToAddress.toInteger())
            } else if(returnToAddress.has('address1')){
                sr.returnToAddress = Address.get(jsonObject.returnToAddress.id.toInteger())
                
            }
        } 
        sr
    }

    // For a press user creating a sample request, it will always use the user's
    // address or 
    def destinationAddressPress(SampleRequest sr, JSONObject jsonObject){
        log.info "Destination Address Press"
        
        if(jsonObject.has('deliverTo') && jsonObject.deliverTo.originalId == null){
            log.info "destination address press has DeliverTo"+jsonObject.deliverTo
            def aUser = User.get(jsonObject.deliverTo.id.toInteger())
            
            if((aUser) && sr.deliverTo != aUser){
                sr.pressHouse = aUser.pressHouse
                log.info "Press User:"+aUser.name + " " + aUser.surname
                sr.deliverTo = aUser
                if(aUser.address) {
                    sr.addressDestination = aUser.address
                    log.info "destination is press user's address"+aUser.address
                } else {
                    sr.addressDestination = Address.findByPressHouseAndDefaultAddress(sr.pressHouse, true)
                    if(!sr.addressDestination)
                        sr.addressDestination = Address.findByPressHouse(sr.pressHouse)
                }
            } 
        } else{ 
            //Brand user editing a Press sample request
            log.info "getting address ad-hoc"
            Address address = Address.get(jsonObject.deliverTo.originalId.toInteger())
            if(address){
                sr.addressDestination = address
            }
        }
        log.info "destination address press outcome:"+sr.addressDestination
        sr
    }

    // DeliverTo is a User in SampleRequest domain object. However, the UI sets DeliverTo
    // with a User or a adhoc address and we tease them apart here.
    def destinationAddressBrand(SampleRequest sr,JSONObject jsonObject){
        log.info "Destination Address Brand"
    
        
        if(jsonObject.has('deliverTo')){
            //DeliverTo may be a User or an ad-hoc address on initial save
            //UI updates DeliverTo and we update addressDestination here
            def destino = jsonObject.deliverTo 
            log.info "deliverTo:"+destino
            if(destino.type){
                if(jsonObject.deliverTo.type  == 'user') {
                    log.info "deliver To type is User"
                    def aUser = User.get(jsonObject.deliverTo.userId.toInteger())
                    if(aUser.address){
                        sr.addressDestination = aUser.address
                    } else {
                        sr.addressDestination = Address.findByBrandAndDefaultAddress(aUser.brand, true)
                    }
                    sr.deliverTo = aUser
                } else{
                    // lookup ad-hoc address
                    log.info "deliver To type is adhoc"
                    sr.addressDestination = Address.get(jsonObject.deliverTo.originalId.toInteger())
                    log.info "new destination is:" +sr.addressDestination.name
                    sr.deliverTo = null
                }
            } else {
                // if no destino.type ...?
            }
        
        } 
        sr
    }


    def updateSampleRequest(JSONObject jsonObject){
        SimpleDateFormat dateFormat =  new SimpleDateFormat(dateFormatString)
        SimpleDateFormat dateTimeFormat =  new SimpleDateFormat(dateTimeFormatString, Locale.US)
        SimpleDateFormat dfEn = new SimpleDateFormat("dd-MMM-yyyy", Locale.ENGLISH);
        log.info "update json:"+jsonObject
        SampleRequest sr = SampleRequest.get(jsonObject.id)
        

        SampleRequest.withTransaction { status ->
            
            sr.shippingOut.tracking = jsonObject.shippingOut.tracking
            
            if(jsonObject.shippingOut.startDate){
                log.info "start date:"+jsonObject.shippingOut.startDate
                sr.shippingOut.startDate = dateTimeFormat.parse(jsonObject.shippingOut.startDate)
                log.info "start date parsed:"+sr.shippingOut.startDate
                sr.shippingOut.save(failOnError:true)
            }
            
            sr.shippingReturn.tracking = jsonObject.shippingReturn.tracking
            if(jsonObject.shippingReturn.endDate){
                log.info "end date:"+jsonObject.shippingReturn.endDate
                sr.shippingReturn.endDate = dateTimeFormat.parse(jsonObject.shippingReturn.endDate)
                log.info "end date parsed:"+sr.shippingReturn.endDate
                sr.shippingReturn.save(failOnError:true)
            }
            //remove samples from list - Press User
            jsonObject?.samplesRemoved?.each{ removed ->
                log.info "removing:"+removed
                def item = sr.searchableItems.find { it.id == removed }
                sr.removeFromSearchableItemsProposed(item)
            }
            //add approved samples to final list
            
            jsonObject.searchableItemsProposed.each{ sample ->
                
                def statusJSON = jsonObject.searchableItemsStatus.find { it.itemId == sample.id }
                def statusObject = sr.searchableItemsStatus.find { it.itemId == sample.id }
                log.info "status:"+statusJSON.status
                if(statusJSON.status == "Approved"){
                    statusObject.status = "Approved"
                    log.info "item status:"+statusObject.status
                    statusObject.save(failOnError:true)
                    def item = sr.searchableItems.find{it.id == sample.id}
                    if(!item){
                        sr.addToSearchableItems(sample)
                    }
                } else if(statusJSON.status == "Denied"){
                    statusObject.status = "Denied"
                    log.info "item status:"+statusObject.status
                    statusObject.save(failOnError:true)
                }
            }

            if(jsonObject.pickupDate){
                sr.pickupDate = dfEn.parse(jsonObject.pickupDate)
                log.info "pickup date:"+jsonObject.pickupDate
                log.info "pickup date sample request:"+sr.pickupDate
            }
            if(jsonObject.pickupDateReturn){
                sr.pickupDateReturn = dfEn.parse(jsonObject.pickupDateReturn)
            }
            sr.pickupTime = jsonObject.pickupTime
            sr.pickupTimeReturn = jsonObject.pickupTimeReturn

            sr.paymentOut = jsonObject.paymentOut
            sr.paymentReturn = jsonObject.paymentReturn
            sr.courierOut = jsonObject.courierOut
            sr.courierReturn = jsonObject.courierReturn



            // truncate if necessary 
            if (jsonObject.message) {
                if (jsonObject.message.length() > SampleRequest.constrainedProperties.message.maxSize)
                    sr.message = jsonObject.message.take(SampleRequest.constrainedProperties.message.maxSize)
                else 
                    sr.message = jsonObject.message
            }

            if(sr.shippingOut.stuartQuoteId == null){
                if(sr.pressHouse){
                    sr = destinationAddressPress(sr,jsonObject)
                } else {
                    sr = destinationAddressBrand(sr,jsonObject)
                }
            }
            sr = returnToAddress(sr,jsonObject)
            sr.save(failOnError:true,flush:true)
            log.info "UPDATED SAMPLE REQUEST:"+sr.id
        }
        sr
    }
}
