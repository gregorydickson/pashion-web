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
            
            sr.returnToAddress = Address.get(jsonObject.returnToAddress.toInteger())
            if(jsonObject?.deliverTo?.surname != null) {
                def aUser = User.get(jsonObject.deliverTo.id.toInteger())
                if(aUser.pressHouse) {
                    sr.pressHouse = aUser.pressHouse
                    sr.addressDestination = Address.findByPressHouseAndDefaultAddress(sr.pressHouse, true)
                } else{
                    sr.addressDestination = aUser.address
                }
                sr.deliverTo = aUser
            } else{
                sr.addressDestination = Address.get(jsonObject.deliverTo.id.toInteger())
            }
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
            
            
            sr.dateRequested = new Date()
            sr.save(failOnError : true, flush: true)
            log.info "SAVED SAMPLE REQUEST:"+sr.id
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
            
            sr.deliverTo = User.get(jsonObject.deliverTo.id)

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
            
            sr.save(failOnError:true,flush:true)
            log.info "UPDATED SAMPLE REQUEST:"+sr.id
        }
        sr
    }
}
