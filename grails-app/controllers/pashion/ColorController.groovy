package pashion

import static org.springframework.http.HttpStatus.*
import grails.transaction.Transactional

@Transactional(readOnly = true)
class ColorController {

    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond Color.list(params), model:[colorCount: Color.count()]
    }

    def show(Color color) {
        respond color
    }

    def create() {
        respond new Color(params)
    }

    @Transactional
    def save(Color color) {
        if (color == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        if (color.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond color.errors, view:'create'
            return
        }

        color.save flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.created.message', args: [message(code: 'color.label', default: 'Color'), color.id])
                redirect color
            }
            '*' { respond color, [status: CREATED] }
        }
    }

    def edit(Color color) {
        respond color
    }

    @Transactional
    def update(Color color) {
        if (color == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        if (color.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond color.errors, view:'edit'
            return
        }

        color.save flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.updated.message', args: [message(code: 'color.label', default: 'Color'), color.id])
                redirect color
            }
            '*'{ respond color, [status: OK] }
        }
    }

    @Transactional
    def delete(Color color) {

        if (color == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        color.delete flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.deleted.message', args: [message(code: 'color.label', default: 'Color'), color.id])
                redirect action:"index", method:"GET"
            }
            '*'{ render status: NO_CONTENT }
        }
    }

    protected void notFound() {
        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.not.found.message', args: [message(code: 'color.label', default: 'Color'), params.id])
                redirect action: "index", method: "GET"
            }
            '*'{ render status: NOT_FOUND }
        }
    }
}
