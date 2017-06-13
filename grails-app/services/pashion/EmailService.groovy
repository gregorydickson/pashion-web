package pashion
import pashion.SearchableItem
import org.json.*
import javax.annotation.PostConstruct
import grails.transaction.Transactional

import static java.util.concurrent.TimeUnit.*
import static grails.async.Promises.*
import grails.async.Promise

import reactor.spring.context.annotation.*
import groovy.transform.Synchronized

import javax.mail.Message
import javax.mail.Session
import javax.mail.internet.InternetAddress
import javax.mail.internet.MimeMessage
import javax.mail.PasswordAuthentication
import javax.mail.Transport
import grails.converters.JSON

import com.sendgrid.*
import java.io.IOException
import org.apache.commons.codec.binary.Base64

@Transactional
@Consumer
class EmailService {

    static scope = "singleton"
    
    @Selector('grantAccessRequestEmail')
    void grantAccessRequestEmailNotification(Object data){
        log.info"grant access email"
        log.info "params:"+data
        
        try {
            
            def messageTxt = "<br/>" 
            
            messageTxt += data.requestingUser 
            messageTxt +=  " is requesting access for a new user: "
            messageTxt +=  data.newUser
            messageTxt += "<br/><br/>"
            messageTxt += "This message is from the New Connection Dialog in the app."


            Email from = new Email("richard@pashiontool.com")
            String subject =  "Access request for " + data.newUser
            Email to = new Email("support@pashiontool.com")
            Content content = new Content("text/html", messageTxt)
            Mail mail = new Mail(from, subject, to, content)

            Base64 x = new Base64()
            
            String encoded = new String(x.encode(messageTxt.getBytes()));

            SendGrid sg = new SendGrid("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");
            Request request = new Request();
    
            request.method = Method.POST;
            request.endpoint = "mail/send";
            request.body = mail.build();
            Response response = sg.api(request);
            log.info response.statusCode.toString()
            
        } catch (Exception e) {
            log.error "exception access request mail"
            log.error e.message
        }
    }

    @Selector('sampleRequestEmail')
    void sampleRequestEmailNotification(Object data){
        log.info"sample request mail"
        log.info "params:"+data
        
        try {
            
            SampleRequest sr = data
            def messageTxt = "<br/>" 
            log.info "email notificaiton start message: " + sr
            messageTxt = messageTxt + '<table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td align="center">'
            messageTxt = messageTxt + '<br/><img src="https://app.pashiontool.com/assets/PashionRMPlainBlack.png" style="max-width:350px;">'
            messageTxt = messageTxt + "<br/><br/>"
            messageTxt = messageTxt + "Booking confirmation of samples from <b>" + sr.brand.name+ "</b> Look "+sr.look+"<br/><br/><br/>" 

            messageTxt = messageTxt + '<img src="https:' + sr.image + '" style="max-width:258px;"><br/><br/>'
            messageTxt = messageTxt + '</td> </tr></table><br/>'

            log.info "message text + image address: " + messageTxt
            
            sr.searchableItemsProposed.each{
                messageTxt = messageTxt + "<b>Sample: </b>" +it?.attributes+"<br/>"
            }
            messageTxt = messageTxt +"<br/>"
            
            messageTxt = messageTxt + "<b>Start Date: </b>" +sr.bookingStartDate?.format('yyyy-MMM-dd')+"<br/>"
            messageTxt = messageTxt + "<b>End Date: </b>" +sr.bookingEndDate?.format('yyyy-MMM-dd')+"<br/><br/>"
            messageTxt = messageTxt + "<b>Required By: </b>" +sr.requiredBy+"<br/>"
            if (sr.deliverTo) { 
                log.info "sr.deliverTo OK"
                if (sr.deliverTo.name) {
                    messageTxt = messageTxt + "<b>Deliver To: </b>" +sr.deliverTo?.name + " " + sr.deliverTo?.surname +"<br/>"
                    log.info "sr.deliverTo.name OK"
            
                }
            }
            else log.info "sr.deliverTo MISSING"

            messageTxt = messageTxt + "<b>Courier Out: </b>" +sr.courierOut +"<br/>"
            messageTxt = messageTxt + "<b>Payment: </b>" +sr.paymentOut +"<br/>"
            messageTxt = messageTxt + "<b>To be Returned By: </b>" +sr.returnBy +"<br/>"
            
            /*if(sr.returnToAddress) {
                messageTxt = messageTxt + "<b>Return To: </b>" +sr.returnToAddress?.name +"<br/>"
                messageTxt = messageTxt + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + sr.returnToAddress?.address1 + " " + sr.returnToAddress?.address2 + "<br/>"
               // if(sr.returnToAddress.address2)
                //    messageTxt = messageTxt + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + sr.returnToAddress?.address2 +"<br/>"
                messageTxt = messageTxt + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + sr.returnToAddress?.city +"<br/>"
                messageTxt = messageTxt + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + sr.returnToAddress?.country +"<br/>"
                messageTxt = messageTxt + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + sr.returnToAddress?.postalCode +"<br/>"
            }
            // Need new code to get returnToAddress from ID for Brand
            // Do we need this for press too? Idea is not, as press will always be reuesting on the platform.
            */
            messageTxt = messageTxt + "<b>Courier Return: </b>" +sr.courierReturn+"<br/>"
            messageTxt = messageTxt + "<b>Payment: </b>" +sr.paymentReturn+"<br/><br/><br/>"

            messageTxt = messageTxt + '<table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td align="center">'
            messageTxt = messageTxt + 'Thanks from the team. <br/> http://www.pashiontool.com <br/><br/>' 
            messageTxt = messageTxt + '<em> Work Visually. Share Effectively. Communicate Faster. </em><br/><br/><br/><br/>'  
            messageTxt = messageTxt + '<small>Image copyright Indigital Images and Pashion Limited</small>'          
            messageTxt = messageTxt + '</td> </tr></table>'

            log.info "created message text"

            Email from = new Email("support@pashiontool.com")
            String subject =  "From the PASHION platform: booking confirmation of " + sr.brand.name + " look "+sr.look
            Email to = new Email(sr.emailNotification)
            Content content = new Content("text/html", messageTxt)
            Mail mail = new Mail(from, subject, to, content)

            Base64 x = new Base64()
            
            String encoded = new String(x.encode(messageTxt.getBytes()));

            SendGrid sg = new SendGrid("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");
            Request request = new Request();
    
            request.method = Method.POST;
            request.endpoint = "mail/send";
            request.body = mail.build();
            Response response = sg.api(request);
            log.info response.statusCode.toString()
            
        } catch (Exception e) {
            log.error "exception sample request mail"
            log.error e.message
        }
    }

    /*
    *  Courier Notification - Out (From Brand)
    */
    def courierOutNotify(List sampleRequests){
        
        log.info "notify courier OUT mail"

        sampleRequests.each{SampleRequest sr ->
            
            
            def  theEmail = sr.requestingUser.email
            def  secondEmail = sr.approvingUser.email
            try {
                def messageTxt = "<br/>" 
                log.info "email notificaiton start message: " + sr
                messageTxt = messageTxt + '<table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td align="center">'
                messageTxt = messageTxt + '<br/><img src="https://app.pashiontool.com/assets/PashionRMPlainBlack.png" style="max-width:350px;">'
                messageTxt = messageTxt + "<br/><br/>"
                messageTxt = messageTxt + "Courier pickup notification of samples from <b>" + sr.brand.name+ "</b> Look "+sr.look+"<br/><br/><br/>" 

                messageTxt = messageTxt + '<img src="https:' + sr.image + '" style="max-width:258px;"><br/><br/>'
                messageTxt = messageTxt + '</td> </tr></table><br/>'

                log.info "message text + image address: " + messageTxt
                
                sr.searchableItemsProposed.each{
                    messageTxt = messageTxt + "<b>Sample: </b>" +it?.attributes+"<br/>"
                }
                messageTxt = messageTxt +"<br/>"
                messageTxt = messageTxt +"<br/>"
                
                messageTxt = messageTxt + "<b>Start Date: </b>" +sr.bookingStartDate?.format('yyyy-MMM-dd')+"<br/>"
                messageTxt = messageTxt + "<b>End Date: </b>" +sr.bookingEndDate?.format('yyyy-MMM-dd')+"<br/><br/>"
                messageTxt = messageTxt + "<b>Required By: </b>" +sr.requiredBy+"<br/>"
                if (sr.deliverTo) { 
                    log.info "sr.deliverTo OK"
                    if (sr.deliverTo.name) {
                        messageTxt = messageTxt + "<b>Deliver To: </b>" +sr.deliverTo?.name + " " + sr.deliverTo?.surname +"<br/>"
                        log.info "sr.deliverTo.name OK"
                    }
                }
                else log.info "sr.deliverTo MISSING"

                messageTxt = messageTxt + "<b>Courier Out: </b>" +sr.courierOut +"<br/>"
                messageTxt = messageTxt + "<b>Payment: </b>" +sr.paymentOut +"<br/>"
                messageTxt = messageTxt + "<b>To be Returned By: </b>" +sr.returnBy +"<br/>"
                
                messageTxt = messageTxt + '<table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td align="center">'
                messageTxt = messageTxt + 'Thanks from the team. <br/> http://www.pashiontool.com <br/><br/>' 
                messageTxt = messageTxt + '<em> Work Visually. Share Effectively. Communicate Faster. </em><br/><br/><br/><br/>'  
                messageTxt = messageTxt + '<small>Image copyright Indigital Images and Pashion Limited</small>'          
                messageTxt = messageTxt + '</td> </tr></table>'

                log.info "created stuart message text"

                Email from = new Email("support@pashiontool.com")
                String subject =  "PASHION: Courier Pickup in One Hour (Approximate)"
                log.info "sending to:"+theEmail
                Email to = new Email(theEmail)
                Email secondTo = new Email(secondEmail)
                Content content = new Content("text/html", messageTxt)
                Mail mail = new Mail(from, subject, to, content)
                Mail mail2 = new Mail(from, subject, secondTo, content)
                
                Base64 x = new Base64()
                String encoded = new String(x.encode(messageTxt.getBytes()));

                SendGrid sg = new SendGrid("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");
                Request request = new Request()
        
                request.method = Method.POST
                request.endpoint = "mail/send"
                request.body = mail.build()
                Response response = sg.api(request)
                log.info response.statusCode.toString()
                
                request = new Request()
                request.method = Method.POST
                request.endpoint = "mail/send"
                request.body = mail2.build()
                response = sg.api(request)
                log.info response.statusCode.toString()

                sr.courierOutNotification = true
                sr.save(flush:true, failOnError:true)

            } catch (Exception e) {
                log.error "exception stuart notification mail"
                log.error e.message
            }
        }

    }



    /*
    *  Courier Notification - Return (From Press)
    */
    def courierReturnNotify(List sampleRequests){
        
        log.info "notify courier Return mail"

        sampleRequests.each{SampleRequest sr ->
            
            
            def  theEmail = sr.requestingUser.email
            def  secondEmail = sr.approvingUser.email
            try {
                def messageTxt = "<br/>" 
                log.info "email notificaiton start message: " + sr
                messageTxt = messageTxt + '<table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td align="center">'
                messageTxt = messageTxt + '<br/><img src="https://app.pashiontool.com/assets/PashionRMPlainBlack.png" style="max-width:350px;">'
                messageTxt = messageTxt + "<br/><br/>"
                messageTxt = messageTxt + "Courier return notification of samples from <b>" + sr.brand.name+ "</b> Look "+sr.look+"<br/><br/><br/>" 

                messageTxt = messageTxt + '<img src="https:' + sr.image + '" style="max-width:258px;"><br/><br/>'
                messageTxt = messageTxt + '</td> </tr></table><br/>'

                log.info "message text + image address: " + messageTxt
                
                sr.searchableItemsProposed.each{
                    messageTxt = messageTxt + "<b>Sample: </b>" +it?.attributes+"<br/>"
                }
                messageTxt = messageTxt +"<br/>"
                messageTxt = messageTxt +"<br/>"
                
                messageTxt = messageTxt + "<b>Start Date: </b>" +sr.bookingStartDate?.format('yyyy-MMM-dd')+"<br/>"
                messageTxt = messageTxt + "<b>End Date: </b>" +sr.bookingEndDate?.format('yyyy-MMM-dd')+"<br/><br/>"
                messageTxt = messageTxt + "<b>Required By: </b>" +sr.requiredBy+"<br/>"
                if (sr.deliverTo) { 
                    log.info "sr.deliverTo OK"
                    if (sr.deliverTo.name) {
                        messageTxt = messageTxt + "<b>Return To: </b>" +sr.deliverTo?.name + " " + sr.deliverTo?.surname +"<br/>"
                        log.info "sr.deliverTo.name OK"
                    }
                }
                else log.info "sr.deliverTo MISSING"

                messageTxt = messageTxt + "<b>Courier Out: </b>" +sr.courierReturn +"<br/>"
                messageTxt = messageTxt + "<b>Payment: </b>" +sr.paymentReturn +"<br/>"
                messageTxt = messageTxt + "<b>To be Returned By: </b>" +sr.returnBy +"<br/>"
                
                messageTxt = messageTxt + '<table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td align="center">'
                messageTxt = messageTxt + 'Thanks from the team. <br/> http://www.pashiontool.com <br/><br/>' 
                messageTxt = messageTxt + '<em> Work Visually. Share Effectively. Communicate Faster. </em><br/><br/><br/><br/>'  
                messageTxt = messageTxt + '<small>Image copyright Indigital Images and Pashion Limited</small>'          
                messageTxt = messageTxt + '</td> </tr></table>'

                log.info "created stuart message text"

                Email from = new Email("support@pashiontool.com")
                String subject =  "PASHION: Courier Pickup in One Hour (Approximate)"
                log.info "sending to:"+theEmail
                Email to = new Email(theEmail)
                Email secondTo = new Email(secondEmail)
                Content content = new Content("text/html", messageTxt)
                Mail mail = new Mail(from, subject, to, content)
                Mail mail2 = new Mail(from, subject, secondTo, content)
                
                Base64 x = new Base64()
                String encoded = new String(x.encode(messageTxt.getBytes()));

                SendGrid sg = new SendGrid("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");
                Request request = new Request()
        
                request.method = Method.POST
                request.endpoint = "mail/send"
                request.body = mail.build()
                Response response = sg.api(request)
                log.info response.statusCode.toString()
                
                request = new Request()
                request.method = Method.POST
                request.endpoint = "mail/send"
                request.body = mail2.build()
                response = sg.api(request)
                log.info response.statusCode.toString()

                sr.courierOutNotification = true
                sr.save(flush:true, failOnError:true)

            } catch (Exception e) {
                log.error "exception stuart notification Return mail"
                log.error e.message
            }
        }

    }

    
    
      
}
