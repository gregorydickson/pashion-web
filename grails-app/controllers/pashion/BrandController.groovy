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

    
    @Transactional
    def addAddress(){
        def jsonObject = request.JSON
        
        log.info "address to add:"+jsonObject
        Address address = new Address()
        address.name =         jsonObject.name
        address.company =      jsonObject.company
        address.address1 =     jsonObject.address1
        address.city =         jsonObject.city
        address.country =      jsonObject.country
        address.postalCode =   jsonObject.postalCode
        address.contactPhone = jsonObject.contactPhone
        address.comment =      jsonObject.comment
        
        address.save(failOnError: true)
        
        Brand brand = Brand.get(session.user.brand.id)
        if(!brand.isAttached()){
            brand.attach()
        }
        brand.addToDestinations(address)
        brand.save(failOnError:true)
        
        def destinations = brand.destinations
        def users = brand.users
        destinations.addAll(users)
        destinations.sort{it.name}
        def response = destinations as JSON

        render response
    }

    def getCalendar(){
        //log.info "getCalendar params=>"+params
        Brand brand = Brand.get(params.id)

        //log.info "getCalendar brand=>"+brand.hideCalendar
        //def response = brand.hideCalendar as JSON
        //log.info "getCalendar=>"+response
        render brand.hideCalendar
    }

    def users(){
        Brand brand = Brand.get(params.id)
        def users = User.findAllByBrand(brand) as JSON
        render users

    }

    def toggleCalendar(){
        Brand brand = Brand.get(params.id)

        if(brand.hideCalendar == false){
            brand.hideCalendar = true
        } else{

            brand.hideCalendar = false
        }
        brand.save(failOnError:true,flush:true)
        respond brand, [status: OK] 

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
