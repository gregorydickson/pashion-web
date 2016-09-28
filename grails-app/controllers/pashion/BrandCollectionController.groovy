package pashion

import static org.springframework.http.HttpStatus.*
import grails.transaction.Transactional
import grails.converters.JSON

@Transactional(readOnly = true)
class BrandCollectionController {

    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond BrandCollection.list(params), model:[brandCollectionCount: BrandCollection.count()]
    }

    def show(BrandCollection brandCollection) {
        respond brandCollection
    }
    

    def looks(BrandCollection brandCollection){
        log.info brandCollection.looks[0]
        respond brandCollection
    }

    def create() {
        respond new BrandCollection(params)
    }
    def seasons(){
        //quick list to get UI going
        def seasons = ['Fall 2016 Couture', 'Spring 2017 Ready-to-Wear',
                        'Spring 2017 Menswear', 'Resort 2017', 'Fall 2016 Ready-to-Wear',
                        'Spring 2016 Couture','Fall 2016 Menswear'] as JSON
        render seasons
    }

    @Transactional
    def save(BrandCollection brandCollection) {
        if (brandCollection == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        if (brandCollection.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond brandCollection.errors, view:'create'
            return
        }

        brandCollection.save flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.created.message', args: [message(code: 'brandCollection.label', default: 'BrandCollection'), brandCollection.id])
                redirect collection
            }
            '*' { respond brandCollection, [status: CREATED] }
        }
    }

    def edit(BrandCollection brandCollection) {
        respond brandCollection
    }

    @Transactional
    def update(BrandCollection brandCollection) {
        if (brandCollection == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        if (brandCollection.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond brandCollection.errors, view:'edit'
            return
        }

        brandCollection.save flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.updated.message', args: [message(code: 'brandCollection.label', default: 'BrandCollection'), brandCollection.id])
                redirect brandCollection
            }
            '*'{ respond brandCollection, [status: OK] }
        }
    }

    @Transactional
    def delete(BrandCollection brandCollection) {

        if (brandCollection == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        brandCollection.delete flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.deleted.message', args: [message(code: 'brandCollection.label', default: 'BrandCollection'), brandCollection.id])
                redirect action:"index", method:"GET"
            }
            '*'{ render status: NO_CONTENT }
        }
    }

    protected void notFound() {
        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.not.found.message', args: [message(code: 'brandCollection.label', default: 'BrandCollection'), params.id])
                redirect action: "index", method: "GET"
            }
            '*'{ render status: NOT_FOUND }
        }
    }
}
