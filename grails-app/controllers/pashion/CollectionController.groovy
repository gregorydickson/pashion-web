package pashion

import static org.springframework.http.HttpStatus.*
import grails.transaction.Transactional

@Transactional(readOnly = true)
class CollectionController {

    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond Collection.list(params), model:[collectionCount: Collection.count()]
    }

    def show(Collection collection) {
        respond collection
    }

    def looks(Collection collection){
        log.info collection.looks[0]
        respond collection
    }

    def create() {
        respond new Collection(params)
    }

    @Transactional
    def save(Collection collection) {
        if (collection == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        if (collection.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond collection.errors, view:'create'
            return
        }

        collection.save flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.created.message', args: [message(code: 'collection.label', default: 'Collection'), collection.id])
                redirect collection
            }
            '*' { respond collection, [status: CREATED] }
        }
    }

    def edit(Collection collection) {
        respond collection
    }

    @Transactional
    def update(Collection collection) {
        if (collection == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        if (collection.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond collection.errors, view:'edit'
            return
        }

        collection.save flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.updated.message', args: [message(code: 'collection.label', default: 'Collection'), collection.id])
                redirect collection
            }
            '*'{ respond collection, [status: OK] }
        }
    }

    @Transactional
    def delete(Collection collection) {

        if (collection == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        collection.delete flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.deleted.message', args: [message(code: 'collection.label', default: 'Collection'), collection.id])
                redirect action:"index", method:"GET"
            }
            '*'{ render status: NO_CONTENT }
        }
    }

    protected void notFound() {
        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.not.found.message', args: [message(code: 'collection.label', default: 'Collection'), params.id])
                redirect action: "index", method: "GET"
            }
            '*'{ render status: NOT_FOUND }
        }
    }
}
