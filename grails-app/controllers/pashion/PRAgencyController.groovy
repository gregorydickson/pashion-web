package pashion

import static org.springframework.http.HttpStatus.*
import grails.transaction.Transactional
import grails.converters.JSON

@Transactional(readOnly = true)
class PRAgencyController {

    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond PRAgency.list(params), model:[PRAgencyCount: PRAgency.count()]
    }

    def addresses(){ 
        // log.info "pragency/addresses id: " + params.id.toInteger()
        def prAgency = PRAgency.get(params.id.toInteger())  
        // log.info "pragency addresses brand: " + brand
        def addresses = prAgency.addresses as JSON 
        // log.info "pragency/addresses addresses: " + addresses
        render addresses
    }

    def show(PRAgency PRAgency) {
        respond PRAgency
    }

    def create() {
        respond new PRAgency(params)
    }

    @Transactional
    def save(PRAgency PRAgency) {
        if (PRAgency == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        if (PRAgency.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond PRAgency.errors, view:'create'
            return
        }

        PRAgency.save flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.created.message', args: [message(code: 'PRAgency.label', default: 'PRAgency'), PRAgency.id])
                redirect PRAgency
            }
            '*' { respond PRAgency, [status: CREATED] }
        }
    }

    def edit(PRAgency PRAgency) {
        respond PRAgency
    }

    @Transactional
    def update(PRAgency PRAgency) {
        if (PRAgency == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        if (PRAgency.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond PRAgency.errors, view:'edit'
            return
        }

        PRAgency.save flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.updated.message', args: [message(code: 'PRAgency.label', default: 'PRAgency'), PRAgency.id])
                redirect PRAgency
            }
            '*'{ respond PRAgency, [status: OK] }
        }
    }

    @Transactional
    def delete(PRAgency PRAgency) {

        if (PRAgency == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        PRAgency.delete flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.deleted.message', args: [message(code: 'PRAgency.label', default: 'PRAgency'), PRAgency.id])
                redirect action:"index", method:"GET"
            }
            '*'{ render status: NO_CONTENT }
        }
    }

    protected void notFound() {
        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.not.found.message', args: [message(code: 'PRAgency.label', default: 'PRAgency'), params.id])
                redirect action: "index", method: "GET"
            }
            '*'{ render status: NOT_FOUND }
        }
    }
}
