package pashion

import static org.springframework.http.HttpStatus.*
import grails.transaction.Transactional
import java.text.SimpleDateFormat
import grails.converters.JSON
import java.time.LocalDate


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

        def lookSeason = ''
        def sent = ''
        def pressHouse = sampleRequest.pressHouse?.name ?: "" 
        def prAgency = sampleRequest.prAgency?.name ?: ""  
        if (sampleRequest.season) {
            lookSeason = Season.findByName(sampleRequest.season.trim()).abbreviation + '.' + sampleRequest.look
            sent = [message:'Sample Request ' + sampleRequest.id + ' (look ' + lookSeason + ') Denied']
            render sent as JSON
            notify "sampleRequestCacheInvalidate",[brand:sampleRequest.brand.name,press: pressHouse, prAgency: prAgency, booking:sampleRequest.id, look:lookSeason]
        }
        else {
            sampleRequest.searchableItems.each{ sample ->
                log.info "sample: " + sample.id
                lookSeason = Season.get(sample.seasonId).abbreviation + '.' + SearchableItem.get(sample.lookId).nameNumber  + SearchableItem.get(sample.lookId).nameVariant
                log.info "lookSeason: " + lookSeason
                notify "sampleRequestCacheInvalidate",[brand:sample.brand.name,press: pressHouse, prAgency: prAgency, booking:sampleRequest.id, look:lookSeason]
            }
            sent = [message:'Sample Request ' + sampleRequest.id +  ' Denied']
            log.info "sent: " + sent
            render sent as JSON
        }
    }

    
    def brandApprove(){
        SampleRequest sr = SampleRequest.get(params?.id?.toInteger())
        def json = request.JSON

        if(json){
            sr = sampleRequestService.updateSampleRequest(json)
        }
        Collection items = sr.searchableItemsProposed
        
        
        def notAvailable = items.any{SearchableItem item -> item.notAvailable(sr) == true}
        
        if(notAvailable){
            def message = [message:'Not Available For Requested Dates']
            render message as JSON
            return
        }

        // Need to add check that the smample is still available for the proposed dates before
        // changing the status and approving.
        // Because two requests can come in for the same items.
        // This request should then be denied, with a message.
        // See issue #584
        log.info "** Need to add check that the smample is still available for the proposed dates: #584 **"

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

        def lookSeason = ''
        def sent = ''
        def pressHouse = sr.pressHouse?.name ?: "" 
        def prAgency = sr.prAgency?.name ?: ""  
        if (sr.season) {
            lookSeason = Season.findByName(sr.season.trim()).abbreviation + '.' + sr.look
            sent = [message:'Sample Request ' + sr.id + ' (look ' + lookSeason + ') Approved']
            render sent as JSON
            notify "sampleRequestCacheInvalidate",[brand:sr.brand.name,press: pressHouse, prAgency: prAgency, booking:sr.id, look:lookSeason]
        }
        else {
            sr.searchableItems.each{ sample ->
                log.info "sample: " + sample.id
                lookSeason = Season.get(sample.seasonId).abbreviation + '.' + SearchableItem.get(sample.lookId).nameNumber  + SearchableItem.get(sample.lookId).nameVariant
                log.info "lookSeason: " + lookSeason
                notify "sampleRequestCacheInvalidate",[brand:sample.brand.name,press: pressHouse, prAgency: prAgency, booking:sampleRequest.id, look:lookSeason]
            }
            sent = [message:'Sample Request ' + sr.id +  ' Approved']
            log.info "sent: " + sent
            render sent as JSON
        }
    }
    
    def brandMarkPickedUp(){
        def sampleRequest = SampleRequest.get(params.id.toInteger())
        sampleRequest.requestStatusBrand = "Picked Up"
        sampleRequest.requestStatusPress = "Delivering"
        sampleRequest.save(flush:true)

        def lookSeason = ''
        def sent = ''
        def pressHouse = sampleRequest.pressHouse?.name ?: "" 
        def prAgency = sampleRequest.prAgency?.name ?: ""  
        if (sampleRequest.season) {
            lookSeason = Season.findByName(sampleRequest.season.trim()).abbreviation + '.' + sampleRequest.look
            sent = [message:'Sample Request ' + sampleRequest.id + ' (look ' + lookSeason + ') Picked Up']
            render sent as JSON
            notify "sampleRequestCacheInvalidate",[brand:sampleRequest.brand.name,press: pressHouse, prAgency: prAgency, booking:sampleRequest.id, look:lookSeason]
        }
        else {
            sampleRequest.searchableItems.each{ sample ->
                log.info "sample: " + sample.id
                lookSeason = Season.get(sample.seasonId).abbreviation + '.' + SearchableItem.get(sample.lookId).nameNumber  + SearchableItem.get(sample.lookId).nameVariant
                log.info "lookSeason: " + lookSeason
                notify "sampleRequestCacheInvalidate",[brand:sample.brand.name,press: pressHouse, prAgency: prAgency, booking:sampleRequest.id, look:lookSeason]
            }
            sent = [message:'Sample Request ' + sampleRequest.id +  ' Picked Up']
            log.info "sent: " + sent
            render sent as JSON
        }
    }

    def brandMarkReturned(){
        def sampleRequest = SampleRequest.get(params.id.toInteger())
        sampleRequest.requestStatusBrand = "Returned"
        sampleRequest.requestStatusPress = "Returned"
        sampleRequest.save(flush:true)

        def lookSeason = ''
        def sent = ''
        def pressHouse = sampleRequest.pressHouse?.name ?: "" 
        def prAgency = sampleRequest.prAgency?.name ?: ""  
        if (sampleRequest.season) {
            lookSeason = Season.findByName(sampleRequest.season.trim()).abbreviation + '.' + sampleRequest.look
            sent = [message:'Sample Request ' + sampleRequest.id + ' (look ' + lookSeason + ') Returned']
            render sent as JSON
            notify "sampleRequestCacheInvalidate",[brand:sampleRequest.brand.name,press: pressHouse, prAgency: prAgency, booking:sampleRequest.id, look:lookSeason]
        }
        else {
            sampleRequest.searchableItems.each{ sample ->
                log.info "sample: " + sample.id
                lookSeason = Season.get(sample.seasonId).abbreviation + '.' + SearchableItem.get(sample.lookId).nameNumber  + SearchableItem.get(sample.lookId).nameVariant
                log.info "lookSeason: " + lookSeason
                notify "sampleRequestCacheInvalidate",[brand:sample.brand.name,press: pressHouse, prAgency: prAgency, booking:sampleRequest.id, look:lookSeason]
            }
            sent = [message:'Sample Request ' + sampleRequest.id +  ' Returned']
            log.info "sent: " + sent
            render sent as JSON
        }
    }

    def brandRestocked(){
        def sampleRequest = SampleRequest.get(params.id.toInteger())
        sampleRequest.requestStatusBrand = "Restocked"      
        sampleRequest.save(flush:true)

        def lookSeason = ''
        def sent = ''
        def pressHouse = sampleRequest.pressHouse?.name ?: "" 
        def prAgency = sampleRequest.prAgency?.name ?: ""  
        if (sampleRequest.season) {
            lookSeason = Season.findByName(sampleRequest.season.trim()).abbreviation + '.' + sampleRequest.look
            sent = [message:'Sample Request ' + sampleRequest.id + ' (look ' + lookSeason + ') Restocked']
            render sent as JSON
            notify "sampleRequestCacheInvalidate",[brand:sampleRequest.brand.name,press: pressHouse, prAgency: prAgency, booking:sampleRequest.id, look:lookSeason]
        }
        else {
            sampleRequest.searchableItems.each{ sample ->
                log.info "sample: " + sample.id
                lookSeason = Season.get(sample.seasonId).abbreviation + '.' + SearchableItem.get(sample.lookId).nameNumber  + SearchableItem.get(sample.lookId).nameVariant
                log.info "lookSeason: " + lookSeason
                notify "sampleRequestCacheInvalidate",[brand:sample.brand.name,press: pressHouse, prAgency: prAgency, booking:sampleRequest.id, look:lookSeason]
            }
            sent = [message:'Sample Request ' + sampleRequest.id +  ' Restocked']
            log.info "sent: " + sent
            render sent as JSON
        }
    }

    def brandMarkDeleted(){
        def sampleRequest = SampleRequest.get(params.id.toInteger())
        sampleRequest.requestStatusBrand = "Deleted"
        sampleRequest.requestStatusPress = "Deleted"
        sampleRequest.save(flush:true)

        def lookSeason = ''
        def sent = ''
        def pressHouse = sampleRequest.pressHouse?.name ?: "" 
        def prAgency = sampleRequest.prAgency?.name ?: ""  
        if (sampleRequest.season) {
            lookSeason = Season.findByName(sampleRequest.season.trim()).abbreviation + '.' + sampleRequest.look
            sent = [message:'Sample Request ' + sampleRequest.id + ' (look ' + lookSeason + ') Deleted']
            render sent as JSON
            notify "sampleRequestCacheInvalidate",[brand:sampleRequest.brand.name,press: pressHouse, prAgency: prAgency, booking:sampleRequest.id, look:lookSeason]
        }
        else {
            sampleRequest.searchableItems.each{ sample ->
                log.info "sample: " + sample.id
                lookSeason = Season.get(sample.seasonId).abbreviation + '.' + SearchableItem.get(sample.lookId).nameNumber  + SearchableItem.get(sample.lookId).nameVariant
                log.info "lookSeason: " + lookSeason
                notify "sampleRequestCacheInvalidate",[brand:sample.brand.name,press: pressHouse, prAgency: prAgency, booking:sampleRequest.id, look:lookSeason]
            }
            sent = [message:'Sample Request ' + sampleRequest.id +  ' Deleted']
            log.info "sent: " + sent
            render sent as JSON
        }
    }
    
    //Press only methods
    // assume no trolley for now RM

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
        
        def pressHouse = requestingUser.pressHouse?.name ?: ""

        def prAgency = requestingUser.prAgency?.name ?: ""   
        notify "sampleRequestCacheInvalidate",[brand:sr.brand.name,press: pressHouse, prAgency: prAgency, booking:sr.id, look:lookSeason]

    }

    def saveTrolley(){
        log.info "save trolley"
        def requestingUser = session.user
        def sr = sampleRequestService.saveTrolley(request.JSON,requestingUser)
        def pressHouse = requestingUser.pressHouse?.name ?: ""
         
        def prAgency = requestingUser.prAgency?.name ?: ""
        log.info "agency:"+prAgency   
        notify "trolleyCacheInvalidate",[brand:sr?.brand?.name,press: pressHouse, prAgency: prAgency, booking:sr.id]
        respond sr
    }

    def submitTrolley(){
        log.info "submit trolley"
        def requestingUser = session.user
        def sr
        if(params.id){
            sr = SampleRequest.get(params.id.toInteger())
            sr.finalize = true

            sr.requestStatusBrand = "Finalizing"
            sr.requestStatusPress = "Finalizing"
        
            sr.save(failOnError:true, flush:true)
            log.info "sample request trolly submitted:"+sr
        } else {
            sr = sampleRequestService.submitTrolley(request.JSON,requestingUser)
        }

        def pressHouse = requestingUser.pressHouse?.name ?: ""
         
        def prAgency = requestingUser.prAgency?.name ?: ""
        def brand = requestingUser.brand?.name ?: ""

        log.info "agency:"+prAgency   
        notify "sampleRequestCacheInvalidate",[brand:brand,press: pressHouse, prAgency: prAgency, booking:sr.id]
        respond sr
    }

    def updateTrolley(){
        log.info "update trolley"
        def requestingUser = session.user
        def sr = sampleRequestService.updateTrolley(request.JSON,requestingUser)
        def pressHouse = requestingUser.pressHouse?.name ?: ""
         
        def prAgency = requestingUser.prAgency?.name ?: ""
        def brand = requestingUser.brand?.name ?: ""
        
        log.info "agency:"+prAgency   
        notify "sampleRequestCacheInvalidate",[brand:brand,press: pressHouse, prAgency: prAgency, booking:sr.id]
        respond sr
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
