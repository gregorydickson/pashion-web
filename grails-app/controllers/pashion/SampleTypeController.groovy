package pashion

import static org.springframework.http.HttpStatus.*
import grails.transaction.Transactional

@Transactional(readOnly = true)
class SampleTypeController {

    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond SampleType.list(params), model:[sampleTypeCount: SampleType.count()]
    }

    def show(SampleType sampleType) {
        respond sampleType
    }

    def create() {
        respond new SampleType(params)
    }

    @Transactional
    def save(SampleType sampleType) {
        if (sampleType == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        if (sampleType.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond sampleType.errors, view:'create'
            return
        }

        sampleType.save flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.created.message', args: [message(code: 'sampleType.label', default: 'SampleType'), sampleType.id])
                redirect sampleType
            }
            '*' { respond sampleType, [status: CREATED] }
        }
    }

    def edit(SampleType sampleType) {
        respond sampleType
    }

    @Transactional
    def update(SampleType sampleType) {
        if (sampleType == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        if (sampleType.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond sampleType.errors, view:'edit'
            return
        }

        sampleType.save flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.updated.message', args: [message(code: 'sampleType.label', default: 'SampleType'), sampleType.id])
                redirect sampleType
            }
            '*'{ respond sampleType, [status: OK] }
        }
    }

    @Transactional
    def delete(SampleType sampleType) {

        if (sampleType == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        sampleType.delete flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.deleted.message', args: [message(code: 'sampleType.label', default: 'SampleType'), sampleType.id])
                redirect action:"index", method:"GET"
            }
            '*'{ render status: NO_CONTENT }
        }
    }

    protected void notFound() {
        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.not.found.message', args: [message(code: 'sampleType.label', default: 'SampleType'), params.id])
                redirect action: "index", method: "GET"
            }
            '*'{ render status: NOT_FOUND }
        }
    }
}
