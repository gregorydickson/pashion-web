package pashion

import static org.springframework.http.HttpStatus.*
import grails.transaction.Transactional

@Transactional(readOnly = true)
class PermissionController {

    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond Permission.list(params), model:[permissionCount: Permission.count()]
    }

    def show(Permission permission) {
        respond permission
    }

    def create() {
        respond new Permission(params)
    }

    @Transactional
    def save(Permission permission) {
        if (permission == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        if (permission.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond permission.errors, view:'create'
            return
        }

        permission.save flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.created.message', args: [message(code: 'permission.label', default: 'Permission'), permission.id])
                redirect permission
            }
            '*' { respond permission, [status: CREATED] }
        }
    }

    def edit(Permission permission) {
        respond permission
    }

    @Transactional
    def update(Permission permission) {
        if (permission == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        if (permission.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond permission.errors, view:'edit'
            return
        }

        permission.save flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.updated.message', args: [message(code: 'permission.label', default: 'Permission'), permission.id])
                redirect permission
            }
            '*'{ respond permission, [status: OK] }
        }
    }

    @Transactional
    def delete(Permission permission) {

        if (permission == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        permission.delete flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.deleted.message', args: [message(code: 'permission.label', default: 'Permission'), permission.id])
                redirect action:"index", method:"GET"
            }
            '*'{ render status: NO_CONTENT }
        }
    }

    protected void notFound() {
        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.not.found.message', args: [message(code: 'permission.label', default: 'Permission'), params.id])
                redirect action: "index", method: "GET"
            }
            '*'{ render status: NOT_FOUND }
        }
    }
}
