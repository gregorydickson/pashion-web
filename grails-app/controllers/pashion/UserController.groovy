package pashion

import static org.springframework.http.HttpStatus.*
import grails.transaction.Transactional

import com.stormpath.sdk.account.Account

@Transactional(readOnly = true)
class UserController {

    def userService
    def cookieService

    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE",doLogin:"POST", login:"GET"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
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
               user.account = account
               session.user = user
               redirect(controller:'dashboard',action:'index')
            }


        }
    }

    @Transactional
    def doLogin(){
        log.info "do Login params:"+params
        def account = null
        def user = User.findWhere(email:params['email'])
        if(user){
            account = userService.login(params.email,params.password)

            if(account instanceof Account){
                user.account = account
                session.user = user
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
        
    }

    def edit(User user) {
        respond user
    }

    @Transactional
    def update(User user) {
        if (user == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        if (user.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond user.errors, view:'edit'
            return
        }

        user.save flush:true

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.updated.message', args: [message(code: 'user.label', default: 'User'), user.id])
                redirect user
            }
            '*'{ respond user, [status: OK] }
        }
    }

    @Transactional
    def delete(User user) {

        if (user == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        user.delete flush:true

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
