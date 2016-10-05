package pashion

import static org.springframework.http.HttpStatus.*
import grails.transaction.Transactional

@Transactional(readOnly = true)
class SearchableItemController {

    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 1000, 5000)
        respond SearchableItem.list(params), model:[searchableItemCount: SearchableItem.count()]
    }

    def show(SearchableItem searchableItem) {
        respond searchableItem
    }

    def create() {
        respond new SearchableItem(params)
    }

    @Transactional
    def save(SearchableItem searchableItem) {
        if (searchableItem == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        if (searchableItem.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond searchableItem.errors, view:'create'
            return
        }

        searchableItem.save flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.created.message', args: [message(code: 'searchableItem.label', default: 'SearchableItem'), searchableItem.id])
                redirect searchableItem
            }
            '*' { respond searchableItem, [status: CREATED] }
        }
    }

    def edit(SearchableItem searchableItem) {
        respond searchableItem
    }

    @Transactional
    def update(SearchableItem searchableItem) {
        if (searchableItem == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        if (searchableItem.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond searchableItem.errors, view:'edit'
            return
        }

        searchableItem.save flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.updated.message', args: [message(code: 'searchableItem.label', default: 'SearchableItem'), searchableItem.id])
                redirect searchableItem
            }
            '*'{ respond searchableItem, [status: OK] }
        }
    }

    @Transactional
    def delete(SearchableItem searchableItem) {

        if (searchableItem == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        searchableItem.delete flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.deleted.message', args: [message(code: 'searchableItem.label', default: 'SearchableItem'), searchableItem.id])
                redirect action:"index", method:"GET"
            }
            '*'{ render status: NO_CONTENT }
        }
    }

    protected void notFound() {
        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.not.found.message', args: [message(code: 'searchableItem.label', default: 'SearchableItem'), params.id])
                redirect action: "index", method: "GET"
            }
            '*'{ render status: NOT_FOUND }
        }
    }
}
