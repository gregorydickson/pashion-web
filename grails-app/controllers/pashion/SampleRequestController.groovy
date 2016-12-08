package pashion

import static org.springframework.http.HttpStatus.*
import grails.transaction.Transactional
import java.text.SimpleDateFormat
import grails.converters.JSON


@Transactional(readOnly = false)
class SampleRequestController {

    def sampleRequestService
    def cacheInvalidationService

    String dateFormatString = "yyyy-M-d"
    

    // The not exactly RESTful verbs for updating a Sample Request:

    // Brand methods:
    def brandDeny(){
        def sampleRequest = SampleRequest.get(params.id.toInteger())
        sampleRequest.requestStatusBrand = "Closed"
        sampleRequest.requestStatusPress = "Refused"
        sampleRequest.save(flush:true)
        def sent = [message:'Sample Request Denied']
        render sent as JSON
    }

    
    def brandApprove(){
        SampleRequest sr = SampleRequest.get(params?.id?.toInteger())
        if(!sr){
            sr = sampleRequestService.updateSampleRequest(request.JSON)
        }

        sr.searchableItemsProposed.each{ sample ->
                
                def status = sr.searchableItemsStatus.find { it.itemId == sample.id }
                log.info "status:"+status
                
                status.status = "Approved"
                log.info "item status:"+status.status
                status.save(failOnError:true)
                sr.addToSearchableItems(sample)
        }

        sr.requestStatusBrand = "Approved"
        sr.requestStatusPress = "Approved"
        sr.save(flush:true)
        def sent = [message:'Sample Request Approved']
        render sent as JSON
    }
    def brandSend(){
        //Create/Update a shipping event
        //TODO:API call to Stuart to create a pickup
        //TODO:save tracking info to Sample Request
        def sampleRequest = SampleRequest.get(params.id.toInteger())
                
        sampleRequest.requestStatusBrand = "Picking Up"
        sampleRequest.requestStatusPress = "stet"
        sampleRequest.save(flush:true)
        def sent = [message:'Sample Request Waiting to be Picked Up']
        render sent as JSON
    }

    
    def brandMarkPickedUp(){
        def sampleRequest = SampleRequest.get(params.id.toInteger())
        sampleRequest.requestStatusBrand = "Picked Up"
        sampleRequest.requestStatusPress = "Delivering"
        sampleRequest.save(flush:true)
        def sent = [message:'Sample Request Marked Picked Up']
        render sent as JSON
    }
    def brandMarkReturned(){
        def sampleRequest = SampleRequest.get(params.id.toInteger())
        sampleRequest.requestStatusBrand = "Returned"
        sampleRequest.requestStatusPress = "Returned"
        sampleRequest.save(flush:true)
        def sent = [message:'Sample Request Marked Returned']
        render sent as JSON
    }
    def brandRestocked(){
        def sampleRequest = SampleRequest.get(params.id.toInteger())
        sampleRequest.requestStatusBrand = "Restocked"
        sampleRequest.requestStatusPress = "stet"
        sampleRequest.save(flush:true)
        def sent = [message:'Sample Request Marked ReStocked']
        render sent as JSON
    }
    def brandMarkDeleted(){
        def sampleRequest = SampleRequest.get(params.id.toInteger())
        sampleRequest.requestStatusBrand = "Closed"
        sampleRequest.requestStatusPress = "Refused"
        sampleRequest.save(flush:true)
        def sent = [message:'Sample Request Deleted']
        render sent as JSON
    }
    //Press only methods

    def pressMarkReceived(){
        def sampleRequest = SampleRequest.get(params.id.toInteger())
        sampleRequest.requestStatusBrand = "Out"
        sampleRequest.requestStatusPress = "In House"
        sampleRequest.save(flush:true)
        def sent = [message:'Sample Request In House']
        render sent as JSON
    }
    def pressDelete(){
        def sampleRequest = SampleRequest.get(params.id.toInteger())
        sampleRequest.requestStatusBrand = "Closed"
        sampleRequest.requestStatusPress = "Closed"
        sampleRequest.save(flush:true)
        def sent = [message:'Sample Request Closed']
        render sent as JSON
    }
    def pressShip(){
        def sampleRequest = SampleRequest.get(params.id.toInteger())
        sampleRequest.requestStatusBrand = "stet"
        sampleRequest.requestStatusPress = "Picking Up"
        sampleRequest.save(flush:true)
        def sent = [message:'Sample Request Picking Up']
        render sent as JSON
    }
    
    def pressMarkPickedUp(){
        def sampleRequest = SampleRequest.get(params.id.toInteger())
        sampleRequest.requestStatusBrand = "Returning"
        sampleRequest.requestStatusPress = "Picked Up"
        sampleRequest.save(flush:true)
        def sent = [message:'Sample Request Picking Up']
        render sent as JSON
    }

    


    
    //Create a Sample Request - for a Press User
    def savejson(){
        SimpleDateFormat dateFormat =  new SimpleDateFormat(dateFormatString)
        def jsonObject = request.JSON
        log.info "json:"+jsonObject
        def sr = new SampleRequest()
        sr.bookingStartDate = dateFormat.parse(jsonObject.startDate)

        sr.bookingEndDate = dateFormat.parse(jsonObject.endDate)
        sr.requiredBy = jsonObject.requiredBy
        
        sr.returnToAddress = Address.get(jsonObject.returnToAddress.toInteger())
        def aUser = User.get(jsonObject.deliverTo)
        if(aUser.pressHouse) {
            sr.pressHouse = aUser.pressHouse
            sr.addressDestination = Address.findByPressHouseAndDefaultAddress(sr.pressHouse, true)
        }

        sr.deliverTo = aUser
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
        sr.requestingUser = session.user
        
        
        sr.dateRequested = new Date()
        sr.save(failOnError : true, flush: true)
        cacheInvalidationService.sampleRequests()
        def sent = [message:'Sample Request Sent']
        render sent as JSON

    }

    def updatejson(){
        
        def sr = sampleRequestService.updateSampleRequest(request.JSON)
        
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
