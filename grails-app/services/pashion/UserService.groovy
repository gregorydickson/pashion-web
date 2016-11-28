package pashion

import grails.transaction.Transactional
import javax.annotation.PostConstruct

import java.util.HashMap

import com.stormpath.sdk.account.Account
import com.stormpath.sdk.account.AccountList
import com.stormpath.sdk.application.Application
import com.stormpath.sdk.application.ApplicationList
import com.stormpath.sdk.application.Applications
import com.stormpath.sdk.authc.*
import com.stormpath.sdk.api.ApiKey
import com.stormpath.sdk.api.ApiKeys
import com.stormpath.sdk.client.Client
import com.stormpath.sdk.client.ClientBuilder
import com.stormpath.sdk.client.Clients
import com.stormpath.sdk.directory.CustomData
import com.stormpath.sdk.directory.Directory
import com.stormpath.sdk.group.Group
import com.stormpath.sdk.group.GroupList
import com.stormpath.sdk.group.Groups
import com.stormpath.sdk.resource.ResourceException
import com.stormpath.sdk.tenant.Tenant


@Transactional
class UserService {

	def grailsApplication

	def APPLICATION_NAME = "pashiontool"
	def elle_directory = "https://api.stormpath.com/v1/directories/jVKqqTZOmOFXPWO53PgoY"
	def ralph_lauren = "https://api.stormpath.com/v1/directories/Z14nWfywLDah6jS8NByk2"
	Application stormpathApp
	Client client
	
	@PostConstruct
    def init(){
    	

    	 ApiKey apiKey = ApiKeys.builder()
    	 			.setId(grailsApplication.metadata['stormpath.apiKey.id'])
    	 			.setSecret(grailsApplication.metadata['stormpath.apiKey.secret'])
                 	.build();
    	// Instantiate a builder for your client and set required properties
		ClientBuilder builder = Clients.builder().setApiKey(apiKey);    

		// Build the client instance that you will use throughout your application code
		client = builder.build();

		Tenant tenant = client.getCurrentTenant();
		ApplicationList applications = tenant.getApplications(
        	Applications.where(Applications.name().eqIgnoreCase(APPLICATION_NAME))
		);

		stormpathApp = applications.iterator().next();

		log.debug "stormpath app:"+stormpathApp
    
    }


    Group createGroup(Directory directory,String groupName, String description){
    	Group agroup = client.instantiate(Group.class)
    		.setName(groupName)
    		.setDescription(description)
    	directory.createGroup(agroup)
    	agroup
    }

    def login(def email, def password){
    	def account = null
        // Create an authentication request using the credentials
        if(email && password){
            AuthenticationRequest request = UsernamePasswordRequests.builder()
                    .setUsernameOrEmail(email)
                    .setPassword(password)
                    .build();

            //Now let's authenticate the account with the application:
            try {
                AuthenticationResult result = stormpathApp.authenticateAccount(request)
                account = result.getAccount()
                log.info("Authenticated Account: " + account.getUsername() + ", Email: " + account.getEmail());
            } catch (ResourceException ex) {
                log.error ex.getMessage()
                account = ex.getMessage()
            }
        }
        account
    }

    def createUser(String email,String name,String surname, 
    				 def owner, String rawpassword, Boolean isInPashionNetwork ){
    	def role
    	User user
    	if(owner instanceof Brand){
            log.info "creating Brand user"
    		role = "brand-users"
    		user = new User(name:name,surname:surname, email:email,brand:owner).save(failOnError : true)
    	} else if(owner instanceof PressHouse){
            log.info "creating Brand user"
    		role = "press-users"
    		user = new User(name:name,surname:surname, email:email,pressHouse:owner).save(failOnError : true)
    	}
        Directory directory
        try{
            directory = client.getResource(owner.stormpathDirectory, Directory.class)
            Account account = client.instantiate(Account.class)
                            .setEmail(email)
                            .setGivenName(name)
                            .setSurname(surname)
                            .setPassword(rawpassword)

            directory.createAccount(account)
        } catch(Exception e){

                //TODO: create stormpath directory????
                log.error "No Stormpath Directory for user"
        }
    	 
    
    	
		user
    }


	
}
