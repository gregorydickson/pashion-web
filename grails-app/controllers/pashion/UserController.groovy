package pashion

import static org.springframework.http.HttpStatus.*
import grails.transaction.Transactional
import grails.converters.JSON

import com.stormpath.sdk.account.Account


@Transactional(readOnly = true)
class UserController {

    def userService
    def cookieService

    def connections(){
        respond User.list()
    }
    //   /user/updateConnections
    @Transactional
    def updateConnections(){
        //log.info 'updateConnections called' 
        //log.info "json:"+request.JSON
        def jsonObject = request.JSON
        try{
            jsonObject.each{ user ->
                
                user.connections.each{ connection ->
                    //log.info "connection:"+connection
                    Connection con = Connection.get(connection.id.toInteger())
                    con.connectedUserId = connection.connectedUserId
                    con.connectingStatus = connection.connectingStatus
                    con.numberNewMessages = connection.numberNewMessages
                    con.mostRecentRead = connection.mostRecentRead
                    con.name = connection.name
                    con.save(flush:true,failOnError:true)
                }
            }
        } catch(Exception e){
            log.error "update Connections Error"+e.message
            def error = [message:e.message]
            render error as JSON
            return
        }
        // log.info "update connections OK"
        def sent = [message:'Connection Data Updated']
        render sent as JSON
    }

    
    def index(Integer max) {
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
        def coooookie = cookieService.getCookie("remember")
        def account = null
        if(coooookie){
            log.info "has Cookie:"+coooookie
            def user = User.findWhere(email:coooookie)
            account = userService.login(user.email,user.stormpathString)
            if(account instanceof Account){
               session.account = account
               session.user = user
               redirect(controller:'dashboard',action:'index')
            }
        }
    }

    def guest(){
        session.user = 'guest'
        log.info "logging in as guest"
        redirect (uri:'/dashboard/#guestpage' )
    }

    @Transactional
    def doLogin(){
        log.info "do Login params:"+params
        def account = null
        def user = User.findWhere(email:params['email'])
        log.info "user:"+user.id.toString()
        if(user){
            account = userService.login(params.email,params.password)
            session.user = user                   
            if(account instanceof Account){
                user.account = account
                
                if(params.remember){
                    response.setCookie('remember', user.email)
                    log.info "set cookie"
                    user.stormpathString = params.password
                    user.save(flush:true)
                }

                redirect(controller:'dashboard',action:'index')
            } else{
                flash.message = "wrong password";
                redirect(controller:'user',action:'login')
            }
        } else{
            flash.message = "User not found"
            redirect(controller:'user',action:'login')
        }
    }

    @Transactional
    def save(User user) {
        def owner 
        log.info "params:"+ params
        if(params.pressHouse.id != "null"){
            owner = PressHouse.get(params.pressHouse.id.toInteger())
        } else if (params.brand.id != "null"){
            owner = Brand.get(params.brand.id.toInteger())
        } else if (params.prAgency.id != "null"){
            owner = PRAgency.get(params.prAgency.id.toInteger())
        }

        log.info "params:"+params
        Boolean inNetwork = false
        if(params.isInPashionNetwork) {
            inNetwork = true
        }

        if (user.hasErrors()) {
            respond user.errors, view:'create'
            return
        }

        user = userService.createUser(params, owner, inNetwork)
        
        
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
        log.info "json:"+jsonObject
        if(jsonObject?.id != null){
            user = userService.updateUser(jsonObject,user,session)
            log.info "user update json:"+jsonObject
        } else{
            user = userService.updateUser(params,user, session)
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
    def updatejson() {
        def jsonObject = request.JSON
        log.info "json:"+jsonObject
        def user = session.user
        Account account = session.account
        user = userService.updateUser(jsonObject,user,account)
        
        
       respond user, [status: OK] 
        
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
