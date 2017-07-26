package pashion

import static org.springframework.http.HttpStatus.*
import grails.transaction.Transactional
import grails.converters.JSON

@Transactional(readOnly = true)
class ColorController {

    def list(){
        def list = Color.list().collect{it.name} as JSON
        //list.retainAll { it != "" }
        render list
    }

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond Color.list(params), model:[colorCount: Color.count()]
    }

    def removeMistakes(){
        def mist = new Color();
        mist.name = "";

    }

    def show(Color color) {
        respond color
    }

    def newColor() {
        log.info "params:"+params

        def newColor = new Color()
        newColor.name = params.name
        newColor.save(failOnError:true, flush:true)
        
        def message
        if(newColor.id){
            message = [message:"color saved"] 
            response.status = 200
        }else{
            message = [message:"Error"]
        }
        render message as JSON 
    }

     def delColor() {
        log.info "params:"+params

        def newColor = new Color()
        newColor.name = params.name
        newColor.delete flush:true 
    }

    def create() {
        respond new Color(params)
    }

    @Transactional
    def save(Color color) {
        if (color == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        if (color.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond color.errors, view:'create'
            return
        }

        color.save flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.created.message', args: [message(code: 'color.label', default: 'color'), color.id])
                redirect color
            }
            '*' { respond color, [status: CREATED] }
        }
    }

    def edit(Color color) {
        respond color
    }

    @Transactional
    def update(Color color) {
        if (color == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        if (color.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond color.errors, view:'edit'
            return
        }

        color.save flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.updated.message', args: [message(code: 'color.label', default: 'color'), color.id])
                redirect color
            }
            '*'{ respond color, [status: OK] }
        }
    }

    @Transactional
    def delete(Color color) {

        if (color == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        color.delete flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.deleted.message', args: [message(code: 'color.label', default: 'color'), color.id])
                redirect action:"index", method:"GET"
            }
            '*'{ render status: NO_CONTENT }
        }
    }

    protected void notFound() {
        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.not.found.message', args: [message(code: 'color.label', default: 'color'), params.id])
                redirect action: "index", method: "GET"
            }
            '*'{ render status: NOT_FOUND }
        }
    }
}