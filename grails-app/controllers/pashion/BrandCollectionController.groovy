package pashion

import static org.springframework.http.HttpStatus.*
import grails.transaction.Transactional

@Transactional(readOnly = true)
class BrandCollectionController {



    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond BrandCollection.list(params), model:[brandCollectionCount: BrandCollection.count()]
    }

    def show(BrandCollection brandCollection) {
        respond brandCollection
    }

    def create() {
        respond new BrandCollection(params)
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
                redirect brandCollection
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
