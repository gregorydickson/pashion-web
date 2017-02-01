package pashion

import static org.springframework.http.HttpStatus.*
import grails.transaction.Transactional
import grails.converters.JSON

@Transactional(readOnly = true)
class BrandController {

    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        respond Brand.list(), model:[brandCount: Brand.count()]
    }

    def fastList(){
        def list = Brand.createCriteria().list {
            cache true
            order "name"
        }
        render list as JSON
    }

    def addresses(){ 
        // log.info "brand/addresses id: " + params.id.toInteger()
        def brand = Brand.get(params.id.toInteger())  
        // log.info "brand addresses brand: " + brand
        def addresses = Address.findAllByBrandAndArchived(brand,false,[cache: true]) as JSON
        // log.info "brand/addresses addresses: " + addresses
        render addresses
    }

    def destinations(){
        def brand = session.user.brand
        
        def addresses = brand.destinations as JSON
        
        render addresses
    }

    def addAddress(){
        def jsonObject = request.JSON
        Address address = new Address()
        address.name =       jsonObject.address.name
        address.address1 =   jsonObject.address.address1
        address.address2 =   jsonObject.address.address2
        address.city =       jsonObject.address.city
        address.country =    jsonObject.address.country
        address.postalCode = jsonObject.address.postalCode
        address.attention =  jsonObject.address.attention
        address.save(failOnError: true)
        
        Brand brand = session.user.brand
        brand.addToDestinations(address)
        def response = address as JSON
        render response
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
