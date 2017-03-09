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

        sampleRequest.searchableItems.each{ sample ->
                
                def status = sampleRequest.searchableItemsStatus.find { it.itemId == sample.id }
                log.info "status:"+status
                
                status.status = "Denied"
                log.info "item status:"+status.status
                status.save(failOnError:true)
                
        }
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

    


    // Only for initial creation
    //Create a Sample Request - for a Press User
    def savejson(){
        def requestingUser = session.user
        def sr = sampleRequestService.initialSaveSampleRequest(request.JSON,requestingUser)
        def sent = [message:'Sample Request Sent']
        render sent as JSON
        if(sr.emailNotification)
            notify "sampleRequestEmail", sr

    }

    def updatejson(){
        
        def sr = sampleRequestService.updateSampleRequest(request.JSON)
        
        def sent = [message:'Sample Request Updated']
        render sent as JSON
    }


    def index(){
        //log.info "**************  List Sample Requests ******************"
        long startTime = System.currentTimeMillis()
        def user = session.user
        List<SampleRequest> results
        if(user == 'guest'){
            results = []
            
        } else {
            results = sampleRequestService.listByUserOrganization(user)
            //log.info "sample requests count:"+results.size()
        }
        long endTime = System.currentTimeMillis()
        long duration = (endTime - startTime)
        //log.info "sample requests index database duration:"+duration
        startTime = System.currentTimeMillis()
        respond results
        endTime = System.currentTimeMillis()
        duration = (endTime - startTime)
        //log.info "JSON render duration:"+duration
        //log.info "*******************************************************"
        //log.info ""
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
