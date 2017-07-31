package pashion

import grails.transaction.Transactional
import javax.annotation.PostConstruct

import java.util.HashMap

import java.math.BigInteger
import com.pubnub.api.*

import com.amazonaws.services.s3.model.CannedAccessControlList
import com.amazonaws.services.s3.model.ObjectMetadata

import grails.converters.JSON
import org.apache.commons.codec.binary.Base64
import org.json.XML
import javax.imageio.ImageIO
import javax.servlet.http.HttpServletResponse
import java.awt.image.BufferedImage
import java.util.HashMap

import java.security.*


@Transactional
class UserService {

	def grailsApplication
    def amazonS3Service

    Pubnub pubnub = new Pubnub("pub-c-b5b66a91-2d36-4cc1-96f3-f33188a8cc73", "sub-c-dd158aea-b76b-11e6-b38f-02ee2ddab7fe")


    

    def login(String email, String password){
    	
        // Create an authentication request using the credentials
        if(email && password){
            
            def user = null
            
            try {
                user = User.findWhere(email:email)
                if(!user){
                    return [message: "User not found"]
                }

                if(user.password == hash(password)){
                    return user
                } else{
                    return [message: "wrong password"]
                }
                
            } catch (Exception ex) {
                log.error ex.getMessage()
                
            }
        }
        
    }

    def checkLogin(User user, def password){
        
        if(user && password){
            
            try {
                
                
                if(user.password == hash(password)){
                    return user
                } else{
                    return [message: "wrong password"]
                }
                
            } catch (Exception ex) {
                log.error ex.getMessage() 
            }
        }
        user
    }
    
    def createUser(def params, def owner, Boolean isInPashionNetwork ){
    	log.info "create user"
    	User user
        try{
            // for now default city to 1
            // need to add an office drop down in the new user dialog
            City city = City.get(1)

            String password = hash(params.password)
            /*
            if (params.city){
                log.info "city:"+params.city
                def cityParam = params.city
              //  if(cityParam.id) {
                   // city = City.get(cityParam.id.toInteger())
             //   } else {
                    city = City.get(cityParam.toInteger())
             //   }
            } */

        	if(owner instanceof Brand){

                log.info "createUser() creating Brand user"
        		user = new User(password:password,city:city,title:params.title,phone:params.phone,name:params.name,surname:params.surname, email:params.email,brand:owner,isInPashionNetwork:true).save(flush:true,failOnError: true)
        	} else if(owner instanceof PressHouse){

                log.info "createUser() creating Press user"
        		user = new User(password:password,city:city,title:params.title,phone:params.phone,name:params.name,surname:params.surname, email:params.email,pressHouse:owner,isInPashionNetwork:true).save(flush:true,failOnError: true)
        	} else if(owner instanceof PRAgency){

                log.info "createUser() creating PRAgency user"
                user = new User(password:password,city:city,title:params.title,phone:params.phone,name:params.name,surname:params.surname, email:params.email,prAgency:owner,isInPashionNetwork:true).save(flush:true,failOnError: true)
            }
        
        } catch(Exception e){
                log.error "createUser() ERROR: "+e.message
                log.error e.printStackTrace()
        }
		user
    }

    def uploadAvatar(String data, User user) {

        def ext = data.split("/")[1].split(";")[0]
        String encodingPrefix = "base64,"
        int contentStartIndex = data.indexOf(encodingPrefix) + encodingPrefix.length()
        byte[] imageData = Base64.decodeBase64(data.substring(contentStartIndex))
        def fileName = user.id + new Date().getTime()
        BufferedImage inputImage = ImageIO.read(new ByteArrayInputStream(imageData))
        ByteArrayOutputStream os = new ByteArrayOutputStream()
        ImageIO.write(inputImage, ext, os)
        InputStream is = new ByteArrayInputStream(os.toByteArray())

        ObjectMetadata metadata = amazonS3Service.buildMetadataFromType('image', ext, CannedAccessControlList.PublicRead)
        amazonS3Service.storeInputStream('pashion-profiles-frankfurt', fileName + '.' + ext, is, metadata)

        return 'https://pashion-profiles-frankfurt.s3.amazonaws.com/' + fileName + '.' + ext

    }

    def updateUser(def params){
        log.info "updateUser() UPDATING OTHER USER"
        
        User user = User.get(params.id.toInteger())
        user = updateUser(params,user,ac)


    }

    def updateUser(def params,def user){
            
            User.withTransaction { status ->
                
                user = User.get(user.id)
                
                user.title = params.title
                user.phone = params.phone
                user.name = params.name
                user.surname = params.surname
                if(params.password && params.password != "")
                    user.password = hash(params.password)
                if(params.address?.id)
                    user.address = Address.get(params.address.id)

                try{
                    user.save(failOnError:true, flush:true)
                } catch(Exception e){

                    log.error "updateUser() error:"+e.message
                }
                 
            }

            // invalidate cache here for connected or connecting user     
            Callback callback=new Callback() {}
            def channel = user.email + '_cacheInvalidate'
            log.info "updateUser() send invalidate users on:" + channel
            pubnub.publish(channel, "users" , callback) 

            user
    }



    String hash(String aString){
        MessageDigest sha1 = MessageDigest.getInstance("SHA1")
        byte[] digest  = sha1.digest(aString.getBytes())
        return new BigInteger(1, digest).toString(16)
    }


	
}
