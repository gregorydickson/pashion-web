package pashion

import static org.springframework.http.HttpStatus.*
import grails.transaction.Transactional
import grails.converters.JSON
import java.text.SimpleDateFormat
import java.util.Date

import java.net.URLDecoder

@Transactional(readOnly = true)
class LookController {

    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def elasticSearchService

    def index(Integer max) {
        params.max = Math.min(max ?: 100, 200)
        respond Look.list(params), model:[lookCount: Look.count()]
    }

    def show(Look look) {
        respond look
    }

    def create() {
        respond new Look(params)
    }

    
    
    def filterSearch(){
        def dateFormatString = "yyyy-MM-dd"
        def dateFormat =  new SimpleDateFormat(dateFormatString)
        Date availableFrom = null
        Date availableTo = null
        Brand brand = null
        if(params.brand != "")
            brand = Brand.get(params.brand)
            
        def season = URLDecoder.decode(params.season)
        def itemtype = params.itemType
        if(params.availableFrom != "")
            availableFrom = dateFormat.parse(params.availableFrom)
        if(params.availableTo != "")   
            availableTo = dateFormat.parse(params.availableTo)
        
        
        def keywords = URLDecoder.decode(params.searchtext)
        def looks =  Look.filterResults( brand, season, itemtype, availableFrom, availableTo, keywords).list() as JSON
        //log.info looks
        render looks
    }

    def search(){
        log.info params
        params.max = 3
        def searchtext = URLDecoder.decode(params.searchtext)
        log.info "searchtext:"+searchtext
        def looks = Look.search(searchtext).searchResults as JSON

        
        log.info looks
        render looks
    }

    @Transactional
    def save(Look look) {
        if (look == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        if (look.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond look.errors, view:'create'
            return
        }

        look.save flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.created.message', args: [message(code: 'look.label', default: 'Look'), look.id])
                redirect look
            }
            '*' { respond look, [status: CREATED] }
        }
    }

    def edit(Look look) {
        respond look
    }

    @Transactional
    def update(Look look) {
        if (look == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        if (look.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond look.errors, view:'edit'
            return
        }

        look.save flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.updated.message', args: [message(code: 'look.label', default: 'Look'), look.id])
                redirect look
            }
            '*'{ respond look, [status: OK] }
        }
    }

    @Transactional
    def delete(Look look) {

        if (look == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        look.delete flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.deleted.message', args: [message(code: 'look.label', default: 'Look'), look.id])
                redirect action:"index", method:"GET"
            }
            '*'{ render status: NO_CONTENT }
        }
    }

    protected void notFound() {
        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.not.found.message', args: [message(code: 'look.label', default: 'Look'), params.id])
                redirect action: "index", method: "GET"
            }
            '*'{ render status: NOT_FOUND }
        }
    }
}
