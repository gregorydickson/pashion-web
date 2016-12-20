package pashion

import static org.springframework.http.HttpStatus.*
import grails.transaction.Transactional
import grails.converters.JSON

@Transactional(readOnly = true)
class BrandController {

    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        long startTime = System.currentTimeMillis()
        respond Brand.list(), model:[brandCount: Brand.count()]
        long endTime = System.currentTimeMillis()
        long duration = (endTime - startTime)
        log.info "brand controller:"+duration
    }

    def fastList(){
        def list = Brand.createCriteria().list {
            cache true
        }
        render list as JSON
    }

    def addresses(){
        def brand = Brand.get(params.id.toInteger())
        def addresses = brand.addresses as JSON
        render addresses
    }

    def users(){
        Brand brand = Brand.get(params.id)
        def users = User.findAllByBrand(brand) as JSON
        render users

    }

    def show(Brand brand) {
        respond brand
    }

    def create() {
        respond new Brand(params)
    }

    @Transactional
    def save(Brand brand) {
        if (brand == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        if (brand.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond brand.errors, view:'create'
            return
        }

        brand.save flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.created.message', args: [message(code: 'brand.label', default: 'Brand'), brand.id])
                redirect brand
            }
            '*' { respond brand, [status: CREATED] }
        }
    }

    def edit(Brand brand) {
        respond brand
    }

    @Transactional
    def update(Brand brand) {
        if (brand == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        if (brand.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond brand.errors, view:'edit'
            return
        }

        brand.save flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.updated.message', args: [message(code: 'brand.label', default: 'Brand'), brand.id])
                redirect brand
            }
            '*'{ respond brand, [status: OK] }
        }
    }

    @Transactional
    def delete(Brand brand) {

        if (brand == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        brand.delete flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.deleted.message', args: [message(code: 'brand.label', default: 'Brand'), brand.id])
                redirect action:"index", method:"GET"
            }
            '*'{ render status: NO_CONTENT }
        }
    }

    protected void notFound() {
        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.not.found.message', args: [message(code: 'brand.label', default: 'Brand'), params.id])
                redirect action: "index", method: "GET"
            }
            '*'{ render status: NOT_FOUND }
        }
    }
}
