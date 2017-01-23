package pashion

import static org.springframework.http.HttpStatus.*
import grails.transaction.Transactional
import grails.converters.JSON

@Transactional(readOnly = true)
class PressHouseController {

    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond PressHouse.list(params), model:[pressHouseCount: PressHouse.count()]
    }

    def show(PressHouse pressHouse) {
        respond pressHouse
    }

    def addresses(){
        def pressHouse = PressHouse.get(params.id.toInteger())
        def addresses = Address.findAllByPressHouseAndArchived(pressHouse,false,[cache: true]) as JSON
        render addresses
    }

    def create() {
        respond new PressHouse(params)
    }

    @Transactional
    def save(PressHouse pressHouse) {
        if (pressHouse == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        if (pressHouse.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond pressHouse.errors, view:'create'
            return
        }

        pressHouse.save flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.created.message', args: [message(code: 'pressHouse.label', default: 'PressHouse'), pressHouse.id])
                redirect pressHouse
            }
            '*' { respond pressHouse, [status: CREATED] }
        }
    }

    def edit(PressHouse pressHouse) {
        respond pressHouse
    }

    @Transactional
    def update(PressHouse pressHouse) {
        if (pressHouse == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        if (pressHouse.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond pressHouse.errors, view:'edit'
            return
        }

        pressHouse.save flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.updated.message', args: [message(code: 'pressHouse.label', default: 'PressHouse'), pressHouse.id])
                redirect pressHouse
            }
            '*'{ respond pressHouse, [status: OK] }
        }
    }

    @Transactional
    def delete(PressHouse pressHouse) {

        if (pressHouse == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        pressHouse.delete flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.deleted.message', args: [message(code: 'pressHouse.label', default: 'PressHouse'), pressHouse.id])
                redirect action:"index", method:"GET"
            }
            '*'{ render status: NO_CONTENT }
        }
    }

    protected void notFound() {
        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.not.found.message', args: [message(code: 'pressHouse.label', default: 'PressHouse'), params.id])
                redirect action: "index", method: "GET"
            }
            '*'{ render status: NOT_FOUND }
        }
    }
}
