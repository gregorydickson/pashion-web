package pashion

import static org.springframework.http.HttpStatus.*
import grails.transaction.Transactional
import grails.converters.JSON

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
    def seasons(){
        //quick list to get UI going
        def seasons = ['Fall 2016 Couture', 'Spring 2017 Ready-to-Wear',
                        'Spring 2017 Menswear', 'Resort 2017', 'Fall 2016 Ready-to-Wear',
                        'Spring 2016 Couture','Fall 2016 Menswear'] as JSON
        render seasons
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
