package pashion

import static org.springframework.http.HttpStatus.*
import grails.transaction.Transactional
import grails.converters.JSON
import com.bertramlabs.plugins.SSLRequired


import javax.servlet.http.HttpServletResponse


@Transactional(readOnly = true)
@SSLRequired
class UserController {

    def userService
    def cookieService
    def cachingService

    def usersBrand(){
        log.info "UserController  usersBrand()"
        def company = Brand.get(params.id.toInteger())
        List users = []
        company.users.each{
            users << it
        }
        respond userList:users
    }

    def usersPressHouse(){
        log.info "UserController  usersPressHouse()"
        def company = PressHouse.get(params.id.toInteger())
        List users = []
        company.users.each{
            users << it
        }
        respond userList:users
    }

    def usersPRAgency(){    
        log.info "UserController  usersPRAgency()"
        def company = PRAgency.get(params.id.toInteger())
        List users = []
        company.users.each{
            users << it
        }
        respond userList:users
        
    }

    def connections(){
        log.info "connections() ***************   STARTING  ********************"
        String json = cachingService.connections()
        response.setContentType('application/json')
        render json
        log.info "connections() ***************   END   ********************"
        log.info ""
    }
    
    @Transactional
    def updateConnections(){
        log.info 'updateConnections() called' 
        //log.info "json:"+request.JSON
        def jsonObject = request.JSON
        
        Connection.withTransaction { status ->
            
            jsonObject.each{ user ->
                
                user.connections.each{ connection ->
                    
                    log.info "connection: "+connection
                    Connection con = Connection.get(connection.id.toInteger())
                    if(con){
                        try{
                            con.connectedUserId = connection.connectedUserId
                            con.connectingStatus = connection.connectingStatus
                            con.numberNewMessages = connection.numberNewMessages
                            con.lastMessage = connection.lastMessage
                            con.mostRecentRead = connection.mostRecentRead
                            con.name = connection.name
                            // log.info "con.lastMessage: "+con.lastMessage
                            con.save(flush:true,failOnError:true)
                        } catch(Exception econ){
                            log.error "exception updating connection:"+connection?.id
                        }
                    }
                }
            }
        }
        
        notify "connectionsUpdate","connections"
        log.info "updateConnections() OK"
        def sent = [message:'Connection Data Updated']
        render sent as JSON
    }

    
    def index(Integer max) {
        log.info "index() USERS INDEX ____ **************"
        /*params.max = 5000 // Math.min(max ?: 10, 100)
        if(params.email && params.email != ""){
            def email = URLDecoder.decode(params.email)
            respond User.findByEmail(email)
            return
        }*/
        respond User.list(params), model:[userCount: User.count()]
    }

    def show(User user) {
        respond user
    }

    def create() {
        respond new User(params)
    }

    def logout(){
        session.user = null
        session.invalidate()
        redirect(controller:'user',action:'login')
    }


    def login(){
        
        
    }

 
    @Transactional
    def doLogin(){
        
        def user = null
       
        
        user = userService.login(params.email,params.password)
                           
        if((user != null) && (user instanceof User)){
            
            session.user = user 
            redirect(controller:'dashboard',action:'index')
        } else if(user.message == "wrong password"){
            flash.message = "wrong password"
            redirect(controller:'user',action:'login')
        } else if(user.message == "User not found"){
    
            flash.message = "User not found"
            redirect(controller:'user',action:'login')
        }
        
    }

    @Transactional
    def checkLogin(){
        log.info "checkLogin()"   
        def jsonObject = request.JSON
        def accountT = null
        def userT= User.findWhere(email:jsonObject.email)
        log.info "checkLogin() email: " + jsonObject.email 
        if(userT){
            userT = userService.checkLogin(userT,jsonObject.password)
            //session.user = user                   
            if(userT instanceof User){
                //user.account = account

                //redirect(controller:'dashboard',action:'index')
                log.info "checkLogin() true"
                render([status: true] as JSON)
            } else{
                //flash.message = "wrong password";
                //redirect(controller:'user',action:'login')
                log.info "checkLogin() false"
                render([status: false] as JSON)
            }
        } else{
            //flash.message = "User not found"
            //redirect(controller:'user',action:'login')
            log.info "checkLogin() false"
            render([status: false] as JSON)
        }
    }

    @Transactional
    def save(User user) {
        def owner 
        
        if(params.pressHouse.id != "null"){
            owner = PressHouse.get(params.pressHouse.id.toInteger())
        } else if (params.brand.id != "null"){
            owner = Brand.get(params.brand.id.toInteger())
        } else if (params.prAgency.id != "null"){
            owner = PRAgency.get(params.prAgency.id.toInteger())
        }

        Boolean inNetwork = false
        if(params.isInPashionNetwork) {
            inNetwork = true
        }

        if (user.hasErrors()) {
            respond user.errors, view:'create'
            return
        }
        

        
        user = userService.createUser(params, owner, inNetwork)
        if ( user == null) {
            flash.message = "unknown error"
            respond  view:'create'
            return
        }
        log.info "notify connections update on new user creation"
        notify "connectionsUpdate","connections"
        
        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.created.message', args: [message(code: 'user.label', default: 'user'), user.id])
                redirect user
            }
            '*' { respond user, [status: CREATED] }

        }
    }

    def edit(User user) {
        respond user
    }

    @Transactional
    def update(User user) {
        def jsonObject = request.JSON
        if(jsonObject?.id != null){
            user = userService.updateUser(jsonObject,user)
            
        } else{
            user = userService.updateUser(params,user)           
        }
        
        if (user == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }
        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.updated.message', args: [message(code: 'user.label', default: 'User'), user.id])
                redirect user
            }
            '*'{ respond user, [status: OK] }
        }
    }

    @Transactional
    def createjson() {
        def jsonObject = request.JSON
        def owner
        def user
        
        //RM removed the force to integer
        if(jsonObject.pressHouse){
            owner = PressHouse.get(jsonObject.pressHouse.id)
        } else if (jsonObject.brand.id){
            owner = Brand.get(jsonObject.brand.id)
        } else if (jsonObject.prAgency){
            owner = PRAgency.get(jsonObject.prAgency.id)
        }
        
        def inNetwork = false
        if(jsonObject.isInPashionNetwork) {
            inNetwork = true
        }

        user = userService.createUser(jsonObject, owner, inNetwork) as JSON
        log.info "notify connections update on new user creation"
        notify "connectionsUpdateNewUser","connections"
        
        render user
        
    }

    @Transactional
    def updatejson() {
        def user
        def jsonObject = request.JSON
        
        if(jsonObject.id == session?.user?.id){
            user = session.user
            
            if(user){
                user = userService.updateUser(jsonObject,user)
            } else{
                def response = [error: 'Error No Account'] as JSON
                render response
                return
            }

        } else{ 
            if(user){
                user = userService.updateUser(jsonObject,user)
            } else{
                log.info "I don't believe in fairies"
                def response = [error: 'Error No Account'] as JSON
                render response
                return
            }
        }


        
        
       respond user, [status: OK] 
        
    }

    @Transactional
    def blank(User user){
        user.connections*.delete(failOnError:true)
        

        user.properties.each{
            if(!(user[it.key] instanceof Boolean)){
                
                if(user[it.key] != null){
                    
                    try{
                        user[it.key] = null
                    }catch(Exception e){

                    }
                }
            }
            
        }
        user.save(failOnError: true)
        
        def response = [status: 'OK'] as JSON
        render response
    }
    
    @Transactional
    def delete(User user) {

        if (user == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }
        User.withTransaction { status ->

            user.delete flush:true
        }

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.deleted.message', args: [message(code: 'user.label', default: 'User'), user.id])
                redirect action:"index", method:"GET"
            }
            '*'{ render status: NO_CONTENT }
        }
    }

    def uploadAvatar(User user){

        def params = request.JSON
        def url = ''
        url = userService.uploadAvatar(params.data, user)
        println user

        user.avatar = url
        user.save(flush:true,failOnError:true)

        def data = [
                url: url
        ]

        withFormat {
            json {
                render(status: HttpServletResponse.SC_OK, text: data as JSON, contentType: "application/json")
            }
        }

    }

    def clearAvatar(User user){
        log.debug "add code to remove avatar for: " + user?.id
        
        user.avatar = null
        user.save(flush:true, failOnError:true)

        response.status = 200
        render([status: 'deleted'] as JSON)
    }

    protected void notFound() {
        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.not.found.message', args: [message(code: 'user.label', default: 'User'), params.id])
                redirect action: "index", method: "GET"
            }
            '*'{ render status: NOT_FOUND }
        }
    }
}
