package pashion

import static org.springframework.http.HttpStatus.*
import grails.transaction.Transactional
import grails.converters.JSON

@Transactional(readOnly = true)
class AddressController {


    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond Address.list(params), model:[addressCount: Address.count()]
    }

    def show(Address address) {
        respond address
    }

    def create() {
        respond new Address(params)
    }

    @Transactional
    def save(Address address) {
        if (address == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        if (address.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond address.errors, view:'create'
            return
        }

        address.save flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.created.message', args: [message(code: 'address.label', default: 'Address'), address.id])
                redirect address
            }
            '*' { respond address, [status: CREATED] }
        }
    }

    def edit(Address address) {
        respond address
    }

    @Transactional
    def update(Address address) {
        if (address == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        if (address.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond address.errors, view:'edit'
            return
        }

        address.save flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.updated.message', args: [message(code: 'address.label', default: 'Address'), address.id])
                redirect address
            }
            '*'{ respond address, [status: OK] }
        }
    }

    @Transactional
    def updatejson() {
        
        def jsonObject = request.JSON
        log.info "updateJson address:"+jsonObject
        log.info "params address:"+params
        Address address = Address.get(params.id.toInteger())
        address.name = jsonObject.name
        address.company = jsonObject.company
        address.address1 = jsonObject.address1
        address.address2 = jsonObject.address2
        address.city = jsonObject.city
        address.country = jsonObject.country
        address.postalCode = jsonObject.postalCode
        address.attention = jsonObject.attention
        address.contactPhone = jsonObject.contactPhone
        address.comment = jsonObject.comment

        address.save(failOnError:true)
        
        respond address, [status: OK] 
        
    }

    @Transactional
    def createjson() {
        
        def jsonObject = request.JSON
        log.info "updateJson address:"+jsonObject
        log.info "params address:"+params
        Address address = new Address()

        if(jsonObject.pressHouse) {
            PressHouse pr = PressHouse.get(jsonObject.pressHouse.id.toInteger())
            address.pressHouse = pr
        } else if(jsonObject.brand){
            Brand br = Brand.get(jsonObject.brand.id.toInteger())
            address.brand = br
        } else if(jsonObject.prAgency){
            PRAgency pr = PRAgency.get(jsonObject.prAgency.id.toInteger())
            address.prAgency = pr
        }
        address.name = jsonObject.name
        address.company = jsonObject.company
        address.address1 = jsonObject.address1
        address.address2 = jsonObject.address2
        address.city = jsonObject.city
        address.country = jsonObject.country
        address.postalCode = jsonObject.postalCode
        address.attention = jsonObject.attention
        address.contactPhone = jsonObject.contactPhone
        address.comment = jsonObject.comment

        address.save(failOnError:true)
        def response = address as JSON
        render response
        
    }

    @Transactional
    def delete(Address address) {

        if (address == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        address.delete flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.deleted.message', args: [message(code: 'address.label', default: 'Address'), address.id])
                redirect action:"index", method:"GET"
            }
            '*'{ render status: NO_CONTENT }
        }
    }

    @Transactional
    def archive(Address address) {
        address.archived = true
        address.save(failOnError:true)
        def response = [status: 'OK'] as JSON
        render response
    }

    protected void notFound() {
        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.not.found.message', args: [message(code: 'address.label', default: 'Address'), params.id])
                redirect action: "index", method: "GET"
            }
            '*'{ render status: NOT_FOUND }
        }
    }
}
