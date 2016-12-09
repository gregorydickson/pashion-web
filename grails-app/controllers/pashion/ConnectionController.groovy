package pashion

import static org.springframework.http.HttpStatus.*
import grails.transaction.Transactional
import grails.converters.JSON

@Transactional(readOnly = true)
class ConnectionController {

    // static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond Connection.list(params), model:[connectionCount: Connection.count()]
    }

    def show(Connection connection) {
        respond connection
    }

    def create() {
        respond new Connection(params)
    }

    @Transactional 
    def savejson(){
        
        def jsonObject = request.JSON
        log.info "json:"+jsonObject
        def connection = new Connection()
        
       connection.thing = jsonObject.thing
        
        
        
        connection.save(failOnError : true, flush: true)
        def sent = [message:'Connection Made']
        render sent as JSON
    }
    // /connection/updatejson/23
    @Transactional 
    def denyContact(){
        def connection = Connection.get(params.id.toInteger())
        
        def jsonObject = request.JSON
        log.info "json:"+jsonObject
        connection.connectingStatus = "Denied"
        
        connection.save(failOnError : true, flush: true)
        def connectionString  = 'connection denied'
        def sent = [message:connectionString]
        render sent as JSON
    }

    @Transactional 
    def acceptContact(){
        def connection = Connection.get(params.id.toInteger())
        
        def jsonObject = request.JSON
        log.info "json:"+jsonObject
        connection.connectingStatus = "Accepted"
        
        connection.save(failOnError : true, flush: true)
        def connectionString  = 'connection accepted'
        def sent = [message:connectionString]
        render sent as JSON
    }

    @Transactional 
    def addContactRequest(){
        def jsonObject = request.JSON
        log.info "addContactRequest json: "+jsonObject
        log.info "addContactRequest session.user: " + session.user
        def con = new Connection()
        con.user = session.user //{id: jsonObject.user.id.toInteger()}
        con.connectedUserId = jsonObject.connectedUserId
        con.connectingStatus = "Pending"
        con.numberNewMessages = 0
        con.mostRecentRead = 0
        con.save(flush:true, failOnError:true)
        def sent = [message:'contact request sent']
        render sent as JSON
    }

    @Transactional 
    def addMessageCount(){
        def connection = Connection.get(params.id.toInteger())
        
        def jsonObject = request.JSON
        log.info "addMessageCount for: " + params.id.toInteger() + " json:"+jsonObject
        connection.numberNewMessages = connection.numberNewMessages + 1
        
        connection.save(failOnError : true, flush: true)
        def connectionString  = 'numbers count updated'
        def sent = [message:connectionString]
        render sent as JSON
    }

    @Transactional 
    def saveMostRecentRead(){
        def connection = Connection.get(params.id.toInteger())
        
        def jsonObject = request.JSON
        log.info "saveMostRecentRead for: " + params.id.toInteger() + " json:"+jsonObject
        connection.mostRecentRead = jsonObject.mostRecentRead
        log.info "saveMostRecentRead input as: " + connection.mostRecentRead
        connection.save(failOnError : true, flush: true)
        def connectionString  = 'most recent read updated'
        def sent = [message:connectionString]
        render sent as JSON
    }

    @Transactional 
    def clearUnreadMessages(){
        def connection = Connection.get(params.id.toInteger())
        
        def jsonObject = request.JSON
        log.info "server side: zeroMessage count for: " + params.id.toInteger() + " json:"+jsonObject
        connection.numberNewMessages = 0
        
        connection.save(failOnError : true, flush: true)
        def connectionString  = 'numbers count zeroed: ' + params.id.toInteger()
        def sent = [message:connectionString]
        render sent as JSON
    }

    @Transactional
    def save(Connection connection) {
        if (connection == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        if (connection.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond connection.errors, view:'create'
            return
        }

        connection.save flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.created.message', args: [message(code: 'connection.label', default: 'Connection'), connection.id])
                redirect connection
            }
            '*' { respond connection, [status: CREATED] }
        }
    }

    def edit(Connection connection) {
        respond connection
    }

    @Transactional
    def update(Connection connection) {
        if (connection == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        if (connection.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond connection.errors, view:'edit'
            return
        }

        connection.save flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.updated.message', args: [message(code: 'connection.label', default: 'Connection'), connection.id])
                redirect connection
            }
            '*'{ respond connection, [status: OK] }
        }
    }


    @Transactional
    def delete(Connection connection) {
        log.info "delete " + connection
        if (connection == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        connection.delete flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.deleted.message', args: [message(code: 'connection.label', default: 'Connection'), connection.id])
                redirect action:"index", method:"GET"
            }
            '*'{ render status: NO_CONTENT }
        }

        def sent = [message:'contact request deleted']
        render sent as JSON
    }

    protected void notFound() {
        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.not.found.message', args: [message(code: 'connection.label', default: 'Connection'), params.id])
                redirect action: "index", method: "GET"
            }
            '*'{ render status: NOT_FOUND }
        }
    }
}
