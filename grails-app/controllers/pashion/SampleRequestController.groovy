package pashion

import static org.springframework.http.HttpStatus.*
import grails.transaction.Transactional
import java.text.SimpleDateFormat
import grails.converters.JSON

@Transactional(readOnly = false)
class SampleRequestController {

    def sampleRequestService

    String dateFormatString = "yyyy-M-d"
    SimpleDateFormat dateFormat =  new SimpleDateFormat(dateFormatString)

    // The not exactly RESTful verbs for updating a Sample Request:

    // Brand methods:
    def deny(){
        def sampleRequest = SampleRequest.get(params.id.toInteger())
        sampleRequest.requestStatusBrand = "Closed"
        sampleRequest.requestStatusPress = "Refused"
        sampleRequest.save(flush:true)
        def sent = [message:'Sample Request Denied']
        render sent as JSON
    }
    def ship(){
        def sampleRequest = SampleRequest.get(params.id.toInteger())
        sampleRequest.requestStatusBrand = "Waiting to be Shipped"
        sampleRequest.requestStatusPress = "Approved"
        sampleRequest.save(flush:true)
        def sent = [message:'Sample Request Marked Ready to Ship']
        render sent as JSON
    }
    def send(){
        def sampleRequest = SampleRequest.get(params.id.toInteger())
        sampleRequest.requestStatusBrand = "Waiting to be Picked Up"
        sampleRequest.requestStatusPress = "Waiting to be Delivered"
        sampleRequest.save(flush:true)
        def sent = [message:'Sample Request Waiting to be Picked Up']
        render sent as JSON
    }
    def markPickedUp(){
        def sampleRequest = SampleRequest.get(params.id.toInteger())
        sampleRequest.requestStatusBrand = "Picked Up"
        sampleRequest.requestStatusPress = "In House"
        sampleRequest.save(flush:true)
        def sent = [message:'Sample Request Marked Picked Up']
        render sent as JSON
    }
    def markReturned(){
        def sampleRequest = SampleRequest.get(params.id.toInteger())
        sampleRequest.requestStatusBrand = "Returned"
        sampleRequest.requestStatusPress = "Picked Up"
        sampleRequest.save(flush:true)
        def sent = [message:'Sample Request Marked Returned']
        render sent as JSON
    }
    def restocked(){
        def sampleRequest = SampleRequest.get(params.id.toInteger())
        sampleRequest.requestStatusBrand = "Closed"
        sampleRequest.requestStatusPress = "Returned"
        sampleRequest.save(flush:true)
        def sent = [message:'Sample Request Marked ReStocked']
        render sent as JSON
    }
    def markDeleted(){
        def sampleRequest = SampleRequest.get(params.id.toInteger())
        sampleRequest.requestStatusBrand = "Deleted"
        sampleRequest.requestStatusPress = "Deleted"
        sampleRequest.save(flush:true)
        def sent = [message:'Sample Request Deleted']
        render sent as JSON
    }
    //Press only methods

    def pressMarkReceived(){
        def sampleRequest = SampleRequest.get(params.id.toInteger())
        sampleRequest.requestStatusBrand = "Deleted"
        sampleRequest.requestStatusPress = "Deleted"
        sampleRequest.save(flush:true)
        def sent = [message:'Sample Request Deleted']
        render sent as JSON
    }
    /*
  pressShipSampleRequest(id){
    this.closeSampleRequestMenu(id);
    this.sampleRequestService.pressShipSampleRequest(id).then(message =>{alert(message.message);});
  }
  pressMarkPickedUpSampleRequest(id){
    this.closeSampleRequestMenu(id);
    this.sampleRequestService.pressMarkPickedUpSampleRequest(id).then(message =>{alert(message.message);});
  }
  pressDeleteSampleRequest(id){
    this.closeSampleRequestMenu(id);
    this.sampleRequestService.pressDeleteSampleRequest(id).then(message =>{alert(message.message);});
  }*/
    
    
    def savejson(){
        def jsonObject = request.JSON
        log.info "json:"+jsonObject
        def sr = new SampleRequest()
        sr.bookingStartDate = dateFormat.parse(jsonObject.startDate)

        sr.bookingEndDate = dateFormat.parse(jsonObject.endDate)
        sr.requiredBy = jsonObject.requiredBy
        
        sr.returnToAddress = Address.get(jsonObject.returnToAddress.toInteger())
        def aUser = User.get(jsonObject.deliverTo)
        if(aUser.pressHouse) sr.pressHouse = aUser.pressHouse
        sr.deliverTo = aUser
        sr.returnBy = jsonObject.returnBy

        sr.requestStatusBrand = "Pending"
        sr.requestStatusPress = "Pending"
        sr.itemsGot = 0
        sr.itemsOut = 0
        sr.itemsIn = 0
        SearchableItem item

        jsonObject.samples.each{
            item = SearchableItem.get(it)
            if(!sr.brand) sr.brand = item.brand
            sr.addToSearchableItems(item)
            def status = new BookingStatus()
            status.itemId = item.id
            status.brandStatus = "Not Arrived"
            status.pressStatus = "Not Shot"
            sr.addToSearchableItemsStatus(status)
        } 
        sr.shippingOut = new ShippingEvent(courier:jsonObject.courier).save()
        sr.shippingReturn = new ShippingEvent().save()
        sr.paymentOut = jsonObject.paymentOut
        sr.paymentReturn = jsonObject.paymentReturn
        sr.courierOut = jsonObject.courierOut
        sr.courierReturn = jsonObject.courierReturn
        sr.requestingUser = session.user
        
        
        sr.dateRequested = new Date()
        sr.save(failOnError : true, flush: true)
        def sent = [message:'Sample Request Sent']
        render sent as JSON

    }

    def updatejson(){
        def jsonObject = request.JSON
        log.info "json:"+jsonObject
        def sr = SampleRequest.get(jsonObject.id)
        
        
        
        
        sr.returnToAddress = Address.get(jsonObject.returnToAddress.toInteger())
        def aUser = User.get(jsonObject.deliverTo)
        
        sr.deliverTo = aUser
        sr.returnBy = jsonObject.returnBy

        sr.requestStatus = "Pending"

        SearchableItem item

        jsonObject.searchableItems.each{
            
        } 
        sr.shippingOut = new ShippingEvent(courier:jsonObject.courier).save()
        sr.shippingReturn = new ShippingEvent().save()
        
        
        
        
        sr.save(failOnError : true, flush: true)
        def sent = [message:'Sample Request Updated']
        render sent as JSON
        

    }


    def index(){
        def user = session.user
        List<SampleRequest> results
        if(user == 'guest'){
            results = []
            
        } else {
            results = sampleRequestService.listByUserOrganization(user)
            log.info "sample requests count:"+results.size()
        }
        respond results
    }

    
    def show(SampleRequest sampleRequest) {
        respond sampleRequest
    }

    def create() {
        respond new SampleRequest(params)
    }

    def save(SampleRequest sampleRequest) {
        if (sampleRequest == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        if (sampleRequest.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond sampleRequest.errors, view:'create'
            return
        }

        sampleRequest.save flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.created.message', args: [message(code: 'sampleRequest.label', default: 'SampleRequest'), sampleRequest.id])
                redirect sampleRequest
            }
            '*' { respond sampleRequest, [status: CREATED] }
        }
    }

    def edit(SampleRequest sampleRequest) {
        respond sampleRequest
    }

    def update(SampleRequest sampleRequest) {
        if (sampleRequest == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        if (sampleRequest.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond sampleRequest.errors, view:'edit'
            return
        }

        sampleRequest.save flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.updated.message', args: [message(code: 'sampleRequest.label', default: 'SampleRequest'), sampleRequest.id])
                redirect sampleRequest
            }
            '*'{ respond sampleRequest, [status: OK] }
        }
    }

    def delete(SampleRequest sampleRequest) {

        if (sampleRequest == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        sampleRequest.delete flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.deleted.message', args: [message(code: 'sampleRequest.label', default: 'SampleRequest'), sampleRequest.id])
                redirect action:"index", method:"GET"
            }
            '*'{ render status: NO_CONTENT }
        }
    }

    protected void notFound() {
        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.not.found.message', args: [message(code: 'sampleRequest.label', default: 'SampleRequest'), params.id])
                redirect action: "index", method: "GET"
            }
            '*'{ render status: NOT_FOUND }
        }
    }
}
