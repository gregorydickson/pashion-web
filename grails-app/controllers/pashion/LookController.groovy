package pashion

import static org.springframework.http.HttpStatus.*
import grails.transaction.Transactional

@Transactional(readOnly = true)
class LookController {

    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond Look.list(params), model:[lookCount: Look.count()]
    }

    def show(Look look) {
        respond look
    }

    def create() {
        respond new Look(params)
    }

    @Transactional
    def save(Look look) {
        if (look == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        if (look.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond look.errors, view:'create'
            return
        }

        look.save flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.created.message', args: [message(code: 'look.label', default: 'Look'), look.id])
                redirect look
            }
            '*' { respond look, [status: CREATED] }
        }
    }

    def edit(Look look) {
        respond look
    }

    @Transactional
    def update(Look look) {
        if (look == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        if (look.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond look.errors, view:'edit'
            return
        }

        look.save flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.updated.message', args: [message(code: 'look.label', default: 'Look'), look.id])
                redirect look
            }
            '*'{ respond look, [status: OK] }
        }
    }

    @Transactional
    def delete(Look look) {

        if (look == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        look.delete flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.deleted.message', args: [message(code: 'look.label', default: 'Look'), look.id])
                redirect action:"index", method:"GET"
            }
            '*'{ render status: NO_CONTENT }
        }
    }

    protected void notFound() {
        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.not.found.message', args: [message(code: 'look.label', default: 'Look'), params.id])
                redirect action: "index", method: "GET"
            }
            '*'{ render status: NOT_FOUND }
        }
    }
}
