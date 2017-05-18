package pashion

import static org.springframework.http.HttpStatus.*
import grails.transaction.Transactional
import grails.converters.JSON

@Transactional(readOnly = false)
class PRAgencyController {


    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond PRAgency.list(params), model:[PRAgencyCount: PRAgency.count()]
    }

    // /agency/brands/$agency
    def brands(){
        //log.info "PRAgency/brands params:"+params
        //def pr = PRAgency.get(params?.agency?.toInteger()) 
        def pr = PRAgency.get(params.id.toInteger()) 
        log.info "PRAgency/brands agency:"+pr
        def brands = pr?.brands
        if(brands){
            render brands as JSON
        } else {
            def body = [] as JSON
            render body
        }

    }
    
    // /agency/addBrand/$agency/$brand/
    def addBrand(){
        def agency = PRAgency.get(params.agency.toInteger())
        def brand = Brand.get(params.brand.toInteger())
        log.info "agency:"+agency
        log.info "brand:"+brand
        
        log.info "adding brand to agency"
        if(agency && brand){
            agency.addToBrands(brand)
            agency.save(flush:true,failOnError:true)
            response.status = 200
            def body = [status:"added"] as JSON
            render body
        } else {
            response.status = 200
            def body = [status:"error"] as JSON
                
            render body
        }
    }

    def addresses(){ 
        // log.info "pragency/addresses id: " + params.id.toInteger()
        def prAgency = PRAgency.get(params.id.toInteger())  
        // log.info "pragency addresses brand: " + brand
        def addresses = Address.findAllByPRAgencyAndArchived(prAgency,false) as JSON 
        // log.info "pragency/addresses addresses: " + addresses
        render addresses
    }

    @Transactional
    def addAddress(){
        log.info "addAddress called"
        def jsonObject = request.JSON
        
        log.info "addAddress to add:"+jsonObject
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
        
        PRAgency agency = PRAgency.get(session.user.prAgency.id)
        if(!agency.isAttached()){
            agency.attach()
        }
        agency.addToDestinations(address)
        agency.save(failOnError:true)
        
        def destinations = agency.destinations
        def users = agency.users
        destinations.addAll(users)
        destinations.sort{it.name}
        def response = destinations as JSON

        render response
    }

    def show(PRAgency PRAgency) {
        respond PRAgency
    }

    def create() {
        respond new PRAgency(params)
    }

    @Transactional
    def save(PRAgency PRAgency) {
        if (PRAgency == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        if (PRAgency.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond PRAgency.errors, view:'create'
            return
        }

        PRAgency.save flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.created.message', args: [message(code: 'PRAgency.label', default: 'PRAgency'), PRAgency.id])
                redirect PRAgency
            }
            '*' { respond PRAgency, [status: CREATED] }
        }
    }

    def edit(PRAgency PRAgency) {
        respond PRAgency
    }

    @Transactional
    def update(PRAgency PRAgency) {
        if (PRAgency == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        if (PRAgency.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond PRAgency.errors, view:'edit'
            return
        }

        PRAgency.save flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.updated.message', args: [message(code: 'PRAgency.label', default: 'PRAgency'), PRAgency.id])
                redirect PRAgency
            }
            '*'{ respond PRAgency, [status: OK] }
        }
    }

    @Transactional
    def delete(PRAgency PRAgency) {

        if (PRAgency == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        PRAgency.delete flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.deleted.message', args: [message(code: 'PRAgency.label', default: 'PRAgency'), PRAgency.id])
                redirect action:"index", method:"GET"
            }
            '*'{ render status: NO_CONTENT }
        }
    }

    protected void notFound() {
        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.not.found.message', args: [message(code: 'PRAgency.label', default: 'PRAgency'), params.id])
                redirect action: "index", method: "GET"
            }
            '*'{ render status: NOT_FOUND }
        }
    }
}
