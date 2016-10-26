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
import com.stormpath.sdk.resource.ResourceException
import com.stormpath.sdk.tenant.Tenant


@Transactional
class UserService {

	def grailsApplication

	def APPLICATION_NAME = "pashiontool"
	Application stormpathApp
	
	@PostConstruct
    def init(){
    	

    	 ApiKey apiKey = ApiKeys.builder()
    	 			.setId(grailsApplication.metadata['stormpath.apiKey.id'])
    	 			.setSecret(grailsApplication.metadata['stormpath.apiKey.secret'])
                 	.build();
    	// Instantiate a builder for your client and set required properties
		ClientBuilder builder = Clients.builder().setApiKey(apiKey);    

		// Build the client instance that you will use throughout your application code
		Client client = builder.build();

		Tenant tenant = client.getCurrentTenant();
		ApplicationList applications = tenant.getApplications(
        	Applications.where(Applications.name().eqIgnoreCase(APPLICATION_NAME))
		);

		stormpathApp = applications.iterator().next();

		log.info "stormpath app:"+stormpathApp
    
    }

    def login(String email, String password){
    	def account = null
        // Create an authentication request using the credentials
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
        account
    }


	
}
