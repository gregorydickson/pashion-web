package pashion

import static org.springframework.http.HttpStatus.*
import grails.transaction.Transactional
import grails.converters.JSON

import com.pubnub.api.*

@Transactional(readOnly = true)
class ConnectionController {

    // static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    Pubnub pubnub = new Pubnub("pub-c-b5b66a91-2d36-4cc1-96f3-f33188a8cc73", "sub-c-dd158aea-b76b-11e6-b38f-02ee2ddab7fe")

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

    @Transactional 
    def acceptContact(){
        def jsonObject = request.JSON
        def connectionString
        def sent
        Connection.withTransaction { status ->
            
        
            def connection1 = Connection.get(params.id.toInteger())
            
            
            log.info "acceptContact json:"+jsonObject
            connection1.connectingStatus = "Accepted"
            connection1.save(failOnError : true, flush: true)

            def connection2 = Connection.get(jsonObject.connectedConnId.toInteger())
            connection2.connectingStatus = "Accepted"
            connection2.save(failOnError : true, flush: true)

            connectionString  = 'connection accepted'
            sent = [message:connectionString]
            // invalidate cache here
        }
        Callback callback=new Callback() {
        /*
            connectCallback(String channel, Object message) {
 
                log.info "pubnub call back success from acceptContact"
             
            }
 
            def disconnectCallback(String channel, Object message) {
 
                log.info "pubnub call back success from acceptContact"
             
            }
             
            def reconnectCallback(String channel, Object message) {
             
                log.info "pubnub call back success from acceptContact"
             
            }
             
            def successCallback(String channel, Object message) {
             
                log.info "pubnub call back success from acceptContact"
             
            }
             
            def errorCallback(String channel, PubnubError error) {
             
                log.info "pubnub call back success from acceptContact"
             
            }  
        */
        }
        //
        def channel = jsonObject.fromEmail + '_cacheInvalidate'
        log.info "send invalidate on:" + channel
        pubnub.publish(channel, "refresh the cache please" , callback)


        render sent as JSON
    }

    @Transactional 
    def addContactRequest(){
        def jsonObject = request.JSON
        log.info "addContactRequest json: "+jsonObject
        log.info "addContactRequest: session.user: " + session.user
        def con1 = new Connection()
        con1.user = session.user 
        con1.connectedUserId = jsonObject.user1.connectedUserId
        con1.connectingStatus = 'PendingOut'
        con1.numberNewMessages = jsonObject.user1.numberNewMessages
        con1.mostRecentRead = jsonObject.user1.mostRecentRead
        con1.name = jsonObject.user1.name
        con1.save(flush:true, failOnError:true)

        def con2 = new Connection()
        con2.user = User.findById(jsonObject.user1.connectedUserId) 
        con2.connectedUserId = session.user.id
        con2.connectingStatus = 'PendingIn'
        con2.numberNewMessages = jsonObject.user2.numberNewMessages
        con2.mostRecentRead = jsonObject.user2.mostRecentRead
        con2.name = jsonObject.user2.name
        con2.save(flush:true, failOnError:true)

        def sent = [message:'contact request sent'] 
        // invalidate cache here
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
        //log.info "saveMostRecentRead for: " + params.id.toInteger() + " json:"+jsonObject
        connection.mostRecentRead = jsonObject.mostRecentRead
        //log.info "saveMostRecentRead input as: " + connection.mostRecentRead
        connection.save(failOnError : true, flush: true)
        def connectionString  = 'most recent read updated'
        def sent = [message:connectionString]
        render sent as JSON
    }

    @Transactional 
    def clearUnreadMessages(){
        def connection = Connection.get(params.id.toInteger())
        
        def jsonObject = request.JSON
        //log.info "server side: zeroMessage count for: " + params.id.toInteger() + " json:"+jsonObject
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
        // invalidate cache here
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
        // invalidate cache here
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
        // invalidate cache here
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
