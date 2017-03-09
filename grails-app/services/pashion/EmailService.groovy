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
    
    @Selector('sampleRequestEmail')
    void sampleRequestEmailNotification(Object data){
        log.info"sample request mail"
        log.info "params:"+data
        
        try {
            
            SampleRequest sr = data
            def messageTxt = "" 
            log.info "email notificaiton start message"
            messageTxt = messageTxt + "Booking confirmation of samples from look "+sr.look+"<br/><br/>" 
            
            sr.searchableItemsProposed.each{
                messageTxt = messageTxt + "Sample:" +it?.attributes+"<br/>"
            }
            messageTxt = messageTxt +"<br/>"
            
            messageTxt = messageTxt + "Start Date: " +sr.bookingStartDate?.format('yyyy-MMM-dd')+"<br/>"
            messageTxt = messageTxt + "End Date: " +sr.bookingEndDate?.format('yyyy-MMM-dd')+"<br/>"
            messageTxt = messageTxt + "Required By: " +sr.requiredBy+"<br/>"
            messageTxt = messageTxt + "Deliver To: " +sr.deliverTo?.name + " " + sr.deliverTo?.surname +"<br/>"
            messageTxt = messageTxt + "Courier Out: " +sr.courierOut +"<br/>"
            messageTxt = messageTxt + "Payment: " +sr.paymentOut +"<br/>"
            messageTxt = messageTxt + "To be Returned By: " +sr.returnBy +"<br/>"
            messageTxt = messageTxt + "Return To: " +sr.returnToAddress?.name +"<br/>"
            messageTxt = messageTxt + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + sr.returnToAddress?.address1 +"<br/>"
            if(sr.returnToAddress.address2)
                messageTxt = messageTxt + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + sr.returnToAddress?.address2 +"<br/>"
            messageTxt = messageTxt + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + sr.returnToAddress?.city +"<br/>"
            messageTxt = messageTxt + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + sr.returnToAddress?.country +"<br/>"
            messageTxt = messageTxt + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + sr.returnToAddress?.postalCode +"<br/>"
            messageTxt = messageTxt + "Courier Return: " +sr.courierReturn+"<br/>"
            messageTxt = messageTxt + "Payment: " +sr.paymentReturn+"<br/><br/>"
            messageTxt = messageTxt + "From the PASHION platform http://www.pashiontool.com <br/>"
            log.info "created message text"

            Email from = new Email("support@pashiontool.com")
            String subject =  "From the PASHION platform: booking confirmation of look "+sr.look
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

    



    
    
      
}
