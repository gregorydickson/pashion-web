package pashion

import grails.transaction.Transactional
import org.grails.web.json.JSONObject
import java.text.SimpleDateFormat

@Transactional
class SampleRequestService {

    String dateFormatString = "yyyy-M-d"
    String dateTimeFormatString = "yyyy-MMM-dd HH:mm"
    String dateTimeMonthFormatString = "yyyy-MMM-dd HH:mm"
    def cacheInvalidationService

    def listByUserOrganization(User user) {
    	def criteria = SampleRequest.createCriteria()
        List results = []

        if(user?.brand){
            log.info "brand user get sample requests"
            def brand = user.brand
            results = SampleRequest.findAllByBrand(brand, [cache:true]);
        }
        if(user?.pressHouse){
            log.info "press user get sample requests"
            def pressHouse = user.pressHouse
            results = SampleRequest.findAllByPressHouse(pressHouse, [cache:true]);
        }

        results
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
                log.info "sample request item:"+item
                if(!sr.brand) sr.brand = item.brand
                if(!sr.image) sr.image = item.look.image
                if(!sr.season) sr.season = item.season.name
                if(!sr.look) sr.look = item.look.name
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
            sr.editorialName = jsonObject.editorialName
            sr.editorialWho = jsonObject.editorialWho
            
            
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

    def destinationAddressPress(SampleRequest sr, JSONObject jsonObject){
        if(jsonObject.has('addressDestination')){
            def aUser = User.get(jsonObject.addressDestination.id.toInteger())
            if(aUser){
                if(aUser.pressHouse) {
                    if(aUser.address) {
                        sr.addressDestination = aUser.address
                    } else {
                        sr.addressDestination = Address.findByPressHouseAndDefaultAddress(sr.pressHouse, true)
                    }
                    sr.pressHouse = aUser.pressHouse
                }
            }
        }
        if(jsonObject.has('deliverTo') && jsonObject.deliverTo.id != null){
            sr.deliverTo = User.get(jsonObject.deliverTo.id.toInteger())
        }
        sr
    }

    // sr.DeliverTo is a User which may not be set if the address
    // is an ad-hoc address. sr.destinationAddress may be pulled from 
    // the user's address, or set explicitly if a Brand has used an ad-hoc address
    // 
    def destinationAddressBrand(SampleRequest sr,JSONObject jsonObject){
        log.info "sample request addresses"
    
        
        if(jsonObject.has('deliverTo')){
            //DeliverTo may be a User or an ad-hoc address on initial save
            //UI updates DeliverTo and we update addressDestination here
            def destino = jsonObject.deliverTo 
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

            sr.editorialName = jsonObject.editorialName
            sr.editorialWho = jsonObject.editorialWho
            
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
            
            if(sr.pressHouse){
                sr = destinationAddressPress(sr,jsonObject)
            } else {
                sr = destinationAddressBrand(sr,jsonObject)
            }
            sr = returnToAddress(sr,jsonObject)
            sr.save(failOnError:true,flush:true)
            log.info "UPDATED SAMPLE REQUEST:"+sr.id
        }
        sr
    }
}
