package pashion

import static org.springframework.http.HttpStatus.*
import grails.transaction.Transactional
import java.text.SimpleDateFormat
import grails.converters.JSON


@Transactional(readOnly = false)
class SampleRequestController {

    def sampleRequestService
    def stuartService

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

        sampleRequest.requestStatusBrand = "Denied"
        sampleRequest.requestStatusPress = "Denied"

        // add in "approving user"
        sampleRequest.approvingUser = User.get(session?.user?.id)
        if(sampleRequest.approvingUser.brand) sampleRequest.approvingUserCompany = sampleRequest.approvingUser.brand.name
        if(sampleRequest.approvingUser.pressHouse) sampleRequest.approvingUserCompany = sampleRequest.approvingUser.pressHouse.name
        if(sampleRequest.approvingUser.prAgency) sampleRequest.approvingUserCompany = sampleRequest.approvingUser.prAgency.name

        sampleRequest.save(flush:true)
        def lookSeason = Season.findByName(sampleRequest.season.trim()).abbreviation + '.' + sampleRequest.look
        def sent = [message:'Sample Request ' + sampleRequest.id + ' (look ' + lookSeason + ') Denied']
        render sent as JSON
        def pressHouse = sampleRequest.pressHouse?.name ?: ""  
        def prAgency = sampleRequest.prAgency?.name ?: ""    
        notify "sampleRequestCacheInvalidate",[brand:sampleRequest.brand.name,press: pressHouse, prAgency: prAgency, booking:sampleRequest.id, look:lookSeason]
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

        sr.approvingUser = User.get(session?.user?.id)
        if(sr.approvingUser.brand) sr.approvingUserCompany = sr.approvingUser.brand.name
        if(sr.approvingUser.pressHouse) sr.approvingUserCompany = sr.approvingUser.pressHouse.name
        if(sr.approvingUser.prAgency) sr.approvingUserCompany = sr.approvingUser.prAgency.name
        

        sr.save(flush:true,failOnError:true)
        def lookSeason = Season.findByName(sr.season.trim()).abbreviation + '.' + sr.look
        def sent = [message:'Sample Request ' + sr.id + ' (look ' + lookSeason + ') Approved']
        render sent as JSON
        def pressHouse = sr.pressHouse?.name ?: ""       
        def prAgency = sr.prAgency.name?.name ?: "" 
        //sr.searchableItems[0].look.season.abbreviation
        //log.info "Setting look with season in cache invalidate:"+lookSeason
        notify "sampleRequestCacheInvalidate",[brand:sr.brand.name,press: pressHouse, prAgency: prAgency, booking:sr.id, look:lookSeason] // add season abbrev to methods
    }
    

    
    def brandMarkPickedUp(){
        def sampleRequest = SampleRequest.get(params.id.toInteger())
        sampleRequest.requestStatusBrand = "Picked Up"
        sampleRequest.requestStatusPress = "Delivering"
        sampleRequest.save(flush:true)

        def lookSeason = Season.findByName(sampleRequest.season.trim()).abbreviation + '.' + sampleRequest.look
        def sent = [message:'Sample Request ' + sampleRequest.id + ' (look ' + lookSeason + ') Picked Up']
        render sent as JSON
        def pressHouse = sampleRequest.pressHouse?.name ?: "" 
        def prAgency = sampleRequest.prAgency?.name ?: ""  
        notify "sampleRequestCacheInvalidate",[brand:sampleRequest.brand.name,press: pressHouse, prAgency: prAgency, booking:sampleRequest.id, look:lookSeason]
    }
    def brandMarkReturned(){
        def sampleRequest = SampleRequest.get(params.id.toInteger())
        sampleRequest.requestStatusBrand = "Returned"
        sampleRequest.requestStatusPress = "Returned"
        sampleRequest.save(flush:true)

        def lookSeason = Season.findByName(sampleRequest.season.trim()).abbreviation + '.' + sampleRequest.look
        def sent = [message:'Sample Request ' + sampleRequest.id + ' (look ' + lookSeason + ') Returned']
        render sent as JSON
        def pressHouse = sampleRequest.pressHouse?.name ?: ""         
        def prAgency = sampleRequest.prAgency?.name ?: ""   
        notify "sampleRequestCacheInvalidate",[brand:sampleRequest.brand.name,press: pressHouse, prAgency: prAgency, booking:sampleRequest.id, look:lookSeason]
    }
    def brandRestocked(){
        def sampleRequest = SampleRequest.get(params.id.toInteger())
        sampleRequest.requestStatusBrand = "Restocked"      
        sampleRequest.save(flush:true)

        def lookSeason = Season.findByName(sampleRequest.season.trim()).abbreviation + '.' + sampleRequest.look
        def sent = [message:'Sample Request ' + sampleRequest.id + ' (look ' + lookSeason + ') Restocked']
        render sent as JSON
        def pressHouse = sampleRequest.pressHouse?.name ?: "" 
        def prAgency = sampleRequest.prAgency?.name ?: ""   
        notify "sampleRequestCacheInvalidate",[brand:sampleRequest.brand.name,press: pressHouse, prAgency: prAgency, booking:sampleRequest.id, look:lookSeason]
    }
    def brandMarkDeleted(){
        def sampleRequest = SampleRequest.get(params.id.toInteger())
        sampleRequest.requestStatusBrand = "Deleted"
        sampleRequest.requestStatusPress = "Deleted"
        sampleRequest.save(flush:true)

        def lookSeason = Season.findByName(sampleRequest.season.trim()).abbreviation + '.' + sampleRequest.look
        def sent = [message:'Sample Request ' + sampleRequest.id + ' (look ' + lookSeason + ') Deleted']
        render sent as JSON
        def pressHouse = sampleRequest.pressHouse?.name ?: "" 
        def prAgency = sampleRequest.prAgency?.name ?: ""  
        notify "sampleRequestCacheInvalidate",[brand:sampleRequest.brand.name,press: pressHouse, prAgency: prAgency, booking:sampleRequest.id, look:lookSeason]
    }
    //Press only methods

    def pressMarkReceived(){
        def sampleRequest = SampleRequest.get(params.id.toInteger())
        sampleRequest.requestStatusBrand = "Out"
        sampleRequest.requestStatusPress = "In House"
        sampleRequest.save(flush:true)

        def lookSeason = Season.findByName(sampleRequest.season.trim()).abbreviation + '.' + sampleRequest.look
        def sent = [message:'Sample Request ' + sampleRequest.id + ' (look ' + lookSeason + ') is In House']
        render sent as JSON
        def pressHouse = sampleRequest.pressHouse?.name ?: "" 
        def prAgency = sampleRequest.prAgency?.name ?: ""   
        notify "sampleRequestCacheInvalidate",[brand:sampleRequest.brand.name,press: pressHouse, prAgency: prAgency, booking:sampleRequest.id, look:lookSeason]
    }
    def pressDelete(){
        def sampleRequest = SampleRequest.get(params.id.toInteger())
        sampleRequest.requestStatusBrand = "Withdrawn"
        sampleRequest.requestStatusPress = "Withdrawn"
        sampleRequest.save(flush:true)
        def lookSeason = Season.findByName(sampleRequest.season.trim()).abbreviation + '.' + sampleRequest.look
        def sent = [message:'Sample Request ' + sampleRequest.id + ' (look ' + lookSeason + ') Withdrawn']
        render sent as JSON
        def pressHouse = sampleRequest.pressHouse?.name ?: "" 
        def prAgency = sampleRequest.prAgency?.name ?: ""   
        notify "sampleRequestCacheInvalidate",[brand:sampleRequest.brand.name,press: pressHouse, prAgency: prAgency, booking:sampleRequest.id, look:lookSeason]
    }
    def pressShip(){
        def sampleRequest = SampleRequest.get(params.id.toInteger())
        
        sampleRequest.requestStatusPress = "Picking Up"
        sampleRequest.save(flush:true)

        def lookSeason = Season.findByName(sampleRequest.season.trim()).abbreviation + '.' + sampleRequest.look
        def sent = [message:'Sample Request ' + sampleRequest.id + ' (look ' + lookSeason + ') Picking Up']
        render sent as JSON
        def pressHouse = sampleRequest.pressHouse?.name ?: "" 
        def prAgency = sampleRequest.prAgency?.name ?: ""  
        notify "sampleRequestCacheInvalidate",[brand:sampleRequest.brand.name,press: pressHouse, prAgency: prAgency, booking:sampleRequest.id, look:lookSeason]
    }
    
    def pressMarkPickedUp(){
        def sampleRequest = SampleRequest.get(params.id.toInteger())
        sampleRequest.requestStatusBrand = "Returning"
        sampleRequest.requestStatusPress = "Picked Up"
        sampleRequest.save(flush:true)

        def lookSeason = Season.findByName(sampleRequest.season.trim()).abbreviation + '.' + sampleRequest.look
        def sent = [message:'Sample Request ' + sampleRequest.id + ' (look ' + lookSeason + ') Picked Up']
        render sent as JSON
        def pressHouse = sampleRequest.pressHouse?.name ?: "" 
        def prAgency = sampleRequest.prAgency?.name ?: ""  
        notify "sampleRequestCacheInvalidate",[brand:sampleRequest.brand.name,press: pressHouse, prAgency: prAgency, booking:sampleRequest.id, look:lookSeason]
    }

    


    // Only for initial creation
    //Create a Sample Request - for a Press or Brand User ? prAgency
    def savejson(){
        def requestingUser = session.user
        def sr = sampleRequestService.initialSaveSampleRequest(request.JSON,requestingUser)

        def lookSeason = Season.findByName(sr.season.trim()).abbreviation + '.' + sr.look
        def sent = [message:'Sample Request ' + sr.id + ' (look ' + lookSeason + ') Sent']
        render sent as JSON
        if(sr.emailNotification)
            notify "sampleRequestEmail", sr
        
        def pressHouse = sr.pressHouse?.name ?: "" 
        def prAgency = sr.prAgency?.name?.name ?: ""   
        notify "sampleRequestCacheInvalidate",[brand:sr.brand.name,press: pressHouse, prAgency: prAgency, booking:sr.id, look:lookSeason]

    }

    def updatejson(){
        
        def sr = sampleRequestService.updateSampleRequest(request.JSON)

        def lookSeason = Season.findByName(sr.season.trim()).abbreviation + '.' + sr.look
        def sent = [message:'Sample Request ' + sr.id + ' (look ' + lookSeason + ') Updated']
        render sent as JSON
        def pressHouse = sr.pressHouse?.name ?: "" 
        def prAgency = sr.prAgency?.name ?: ""  
        notify "sampleRequestCacheInvalidate",[brand:sr.brand.name,press: pressHouse, prAgency: prAgency, booking:sr.id, look:lookSeason]
    }


    def index(){
        log.info "**************  List Sample Requests ******************"
        long startTime = System.currentTimeMillis()
        def user = session.user
        List<SampleRequest> results
        if(user == 'guest'){
            results = []
            
        } else {
            results = sampleRequestService.listByUserOrganization(user)
            log.info "sample requests count:"+results.size()
        }
        long endTime = System.currentTimeMillis()
        long duration = (endTime - startTime)
        log.info "sample requests index database duration:"+duration
        startTime = System.currentTimeMillis()
        respond results
        endTime = System.currentTimeMillis()
        duration = (endTime - startTime)
        log.info "SAMPLE REQUEST JSON render duration:"+duration
        log.info "*******************************************************"
        log.info ""
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
