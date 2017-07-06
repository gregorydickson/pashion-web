package pashion

import static org.springframework.http.HttpStatus.*
import grails.transaction.Transactional
import grails.converters.JSON

@Transactional(readOnly = true)
class MaterialController {

    def list(){
        def list = Material.list().collect{it.name} as JSON
        render list
    }

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond Material.list(params), model:[materialCount: Material.count()]
    }

    def show(Material material) {
        respond material
    }

    def newMaterial() {
        log.info params.material;

        def newMaterial = new Material()
        newMaterial.name = params.material
        newMaterial.save(failOnError:true, flush:true)
        
        def message
        if(newMaterial.id){
            message = [message:"Material saved"]
            response.status = 200
        }else{
            message = [message:"Error"]
        }
        render message as JSON
    }

    def create() {
        respond new Material(params)
    }

    @Transactional
    def save(Material material) {
        if (material == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        if (material.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond material.errors, view:'create'
            return
        }

        material.save flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.created.message', args: [message(code: 'material.label', default: 'Material'), material.id])
                redirect material
            }
            '*' { respond material, [status: CREATED] }
        }
    }

    def edit(Material material) {
        respond material
    }

    @Transactional
    def update(Material material) {
        if (material == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        if (material.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond material.errors, view:'edit'
            return
        }

        material.save flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.updated.message', args: [message(code: 'material.label', default: 'Material'), material.id])
                redirect material
            }
            '*'{ respond material, [status: OK] }
        }
    }

    @Transactional
    def delete(Material material) {

        if (material == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        material.delete flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.deleted.message', args: [message(code: 'material.label', default: 'Material'), material.id])
                redirect action:"index", method:"GET"
            }
            '*'{ render status: NO_CONTENT }
        }
    }

    protected void notFound() {
        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.not.found.message', args: [message(code: 'material.label', default: 'Material'), params.id])
                redirect action: "index", method: "GET"
            }
            '*'{ render status: NOT_FOUND }
        }
    }
}
