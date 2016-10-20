package pashion

import static org.springframework.http.HttpStatus.*
import grails.transaction.Transactional
import grails.converters.JSON

@Transactional(readOnly = true)
class SampleRequestController {

    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    
    @Transactional
    def savejson(){
        def jsonObject = request.JSON
        def sr = new SampleRequest()
        sr.bookingStartDate = jsonObject.startDate
        sr.bookingEndDate = jsonObject.endDate
        sr.requiredBy = jsonObject.selectedRequired
        sr.deliverTo = User.findByName("jsonObject.deliverToSelected")
        sr.returnBy = jsonObject.returnBySelected
        sr.returnTo = User.findByName("jsonObject.returnToSelected")
        sr.requestStatus = "Requested"
        
        jsonObject.selectedProductIds.each{
            SearchableItem item = SearchableItem.get(it)
            sr.addToSearchableItems(item)
        } 
        sr.save(failOnError : true, flush: true)
        
        render sr as JSON

    }

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond SampleRequest.list(params), model:[sampleRequestCount: SampleRequest.count()]
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
