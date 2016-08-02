package pashion

import static org.springframework.http.HttpStatus.*
import grails.transaction.Transactional

@Transactional(readOnly = true)
class SampleController {

    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond Sample.list(params), model:[sampleCount: Sample.count()]
    }

    def show(Sample sample) {
        respond sample
    }

    def create() {
        respond new Sample(params)
    }

    @Transactional
    def save(Sample sample) {
        if (sample == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        if (sample.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond sample.errors, view:'create'
            return
        }

        sample.save flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.created.message', args: [message(code: 'sample.label', default: 'Sample'), sample.id])
                redirect sample
            }
            '*' { respond sample, [status: CREATED] }
        }
    }

    def edit(Sample sample) {
        respond sample
    }

    @Transactional
    def update(Sample sample) {
        if (sample == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        if (sample.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond sample.errors, view:'edit'
            return
        }

        sample.save flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.updated.message', args: [message(code: 'sample.label', default: 'Sample'), sample.id])
                redirect sample
            }
            '*'{ respond sample, [status: OK] }
        }
    }

    @Transactional
    def delete(Sample sample) {

        if (sample == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        sample.delete flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.deleted.message', args: [message(code: 'sample.label', default: 'Sample'), sample.id])
                redirect action:"index", method:"GET"
            }
            '*'{ render status: NO_CONTENT }
        }
    }

    protected void notFound() {
        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.not.found.message', args: [message(code: 'sample.label', default: 'Sample'), params.id])
                redirect action: "index", method: "GET"
            }
            '*'{ render status: NOT_FOUND }
        }
    }
}
