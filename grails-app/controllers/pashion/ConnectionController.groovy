package pashion

import static org.springframework.http.HttpStatus.*
import grails.transaction.Transactional

@Transactional(readOnly = true)
class ConnectionController {

    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond Connection.list(params), model:[connectionCount: Connection.count()]
    }

    def show(Connection connection) {
        respond connection
    }

    def create() {
        respond new Connection(params)
    }

    @Transactional
    def save(Connection connection) {
        if (connection == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        if (connection.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond connection.errors, view:'create'
            return
        }

        connection.save flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.created.message', args: [message(code: 'connection.label', default: 'Connection'), connection.id])
                redirect connection
            }
            '*' { respond connection, [status: CREATED] }
        }
    }

    def edit(Connection connection) {
        respond connection
    }

    @Transactional
    def update(Connection connection) {
        if (connection == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        if (connection.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond connection.errors, view:'edit'
            return
        }

        connection.save flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.updated.message', args: [message(code: 'connection.label', default: 'Connection'), connection.id])
                redirect connection
            }
            '*'{ respond connection, [status: OK] }
        }
    }

    @Transactional
    def delete(Connection connection) {

        if (connection == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        connection.delete flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.deleted.message', args: [message(code: 'connection.label', default: 'Connection'), connection.id])
                redirect action:"index", method:"GET"
            }
            '*'{ render status: NO_CONTENT }
        }
    }

    protected void notFound() {
        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.not.found.message', args: [message(code: 'connection.label', default: 'Connection'), params.id])
                redirect action: "index", method: "GET"
            }
            '*'{ render status: NOT_FOUND }
        }
    }
}
