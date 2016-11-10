package pashion

import static org.springframework.http.HttpStatus.*
import grails.transaction.Transactional
import java.text.SimpleDateFormat
import grails.converters.JSON

@Transactional(readOnly = true)
class SampleRequestController {

    def sampleRequestService

    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    String dateFormatString = "yyyy-M-d"
    SimpleDateFormat dateFormat =  new SimpleDateFormat(dateFormatString)
    
    @Transactional
    def savejson(){
        def jsonObject = request.JSON
        log.info "json:"+jsonObject
        def sr = new SampleRequest()
        sr.bookingStartDate = dateFormat.parse(jsonObject.startDate)
        sr.bookingEndDate = dateFormat.parse(jsonObject.endDate)
        sr.requiredBy = jsonObject.requiredBy
        
        sr.returnToAddress = Address.get(jsonObject.returnToAddress.toInteger())
        def presshouseUser = User.get(jsonObject.deliverTo)
        sr.deliverTo = presshouseUser
        sr.returnBy = jsonObject.returnBy

        sr.requestStatus = "Pending"
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
        if(session?.user.pressHouse){
            sr.pressHouse = session.user.pressHouse
            sr.addressDestination = Address.findByPressHouseAndDefault(user.pressHouse,true)
        } else if(presshouseUser?.pressHouse){
            sr.pressHouse = presshouseUser.pressHouse
        }
        
        sr.dateRequested = new Date()
        sr.save(failOnError : true, flush: true)
        def sent = [message:'Sample Request Sent']
        render sent as JSON

    }

    @Transactional
    def updatejson(){
        def jsonObject = request.JSON
        log.info "json:"+jsonObject
        def sr = SampleRequest.get(jsonObject.id)
        
        sr.save(failOnError : true)
        def sent = [message:'Sample Request Updated']
        render sent as JSON

    }


    def index(){
        def user = session.user

        List<SampleRequest> results = sampleRequestService.listByUserOrganization(user)
        log.info "sample requests count:"+results.size()
        respond results
    }

    
    def show(SampleRequest sampleRequest) {
        respond sampleRequest
    }

    def create() {
        respond new SampleRequest(params)
    }

    @Transactional
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

    @Transactional
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

    @Transactional
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
