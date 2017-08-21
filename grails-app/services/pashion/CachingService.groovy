package pashion
import pashion.SearchableItem
import org.json.*
import javax.annotation.PostConstruct
import grails.transaction.Transactional
import grails.converters.JSON

import static java.util.concurrent.TimeUnit.*
import static grails.async.Promises.*
import grails.async.Promise

import reactor.spring.context.annotation.*
import grails.plugin.json.view.test.*
import groovy.transform.Synchronized

import com.pubnub.api.*
//import com.pubnub.api.builder.*
import com.pubnub.api.callbacks.*
//import com.pubnub.api.endpoints.*
//import com.pubnub.api.endpoints.pubsub.*
//import com.pubnub.api.enums.*
//import com.pubnub.api.interceptors.*
//import com.pubnub.api.managers.*
//import com.pubnub.api.models.*
import com.pubnub.api.models.consumer.*
//import com.pubnub.api.models.server.*
//import com.pubnub.api.vendor.*
//import com.pubnub.api.workers.*


@Transactional
@Consumer
class CachingService implements JsonViewTest {

    static lazyInit = false
    static scope = "singleton"
    

    def themes
    String connections = null

    PubNub pubnub = null

    @PostConstruct
    void init() {
        PNConfiguration pnConfiguration = new PNConfiguration()
        pnConfiguration.setSubscribeKey("sub-c-dd158aea-b76b-11e6-b38f-02ee2ddab7fe")
        pnConfiguration.setPublishKey("pub-c-b5b66a91-2d36-4cc1-96f3-f33188a8cc73")
        pnConfiguration.setSecure(true)
           
        pubnub = new PubNub(pnConfiguration)
    }

    @Selector('connectionsUpdate')
    void invalidateConnectionsPubNub(Object data){
        log.info "invalidateConnectionsPubNub "
        String newValue = loadConnections()
        connections = newValue
        def channel = data + '_cacheInvalidate'
        log.info "send invalidate in cachingService:invalidateConnectionsPubNub on:" + channel
        pubnub.publish()

            //.message(Arrays.asList ("connections", "private" ))
            .message("connections")

            
            .channel(channel)
            //.meta({visibility: "private"}) // server side filtering
            .async(new PNCallback<PNPublishResult>() {
                @Override
                public void onResponse(PNPublishResult result, PNStatus status) {
                    log.info "pubnub invalidateConnectionsPubNub publish status code: " + Integer.toString(status.statusCode)
                    if (status.error) info.log "pubNub.publish Error: " + status.errorData.information
                    else if (result.hasProperty("timetoken") && result.timetoken != null) log.info "pubnub publish success, timetoken: " + Long.toString(result.timetoken)
                }
            }) 

    }

    @Selector('connectionsUpdateNewUser')
    void invalidateConnectionsNewUser(Object data){
        Thread.sleep(2000)
        log.info "invalidateConnectionsNewUser "
        String newValue = loadConnections()
        connections = newValue
        def channel = data + '_cacheInvalidate'
        log.info "send invalidate in cachingService:invalidateConnectionsNewUser on:" + channel
        pubnub.publish().message("connections").channel(channel).async(new PNCallback<PNPublishResult>() {
            @Override
            public void onResponse(PNPublishResult result, PNStatus status) {
                log.info "pubnub invalidateConnectionsNewUser publish status code: " + Integer.toString(status.statusCode)
                if (status.error) info.log "pubNub.publish Error: " + status.errorData.information
                else if (result.hasProperty("timetoken") && result.timetoken != null) log.info "pubnub publish success, timetoken: " + Long.toString(result.timetoken)
            }
        }) 
    }

    @Selector('sampleRequestCacheInvalidate')
    void sampleRequestCacheInvalidate(Object data){
        Thread.sleep(2000);
        log.info "sampleRequestCacheInvalidate sample data " + data
        try{
            def channel
            if(data.brand){
                channel = data.brand+'_cacheInvalidate'
                log.info "send Bookings Cache invalidate in cachingService Brand:" + channel + " data > " + data
                // channel = company name
                // data.booking = SR id
                // data.look = look id (name)
                pubnub.publish().message(data.booking + " (look " + data.look + ")").channel(channel).async(new PNCallback<PNPublishResult>() {
                    @Override
                    public void onResponse(PNPublishResult result, PNStatus status) {
                        log.info "pubnub sampleRequestCacheInvalidate publish status code: " + Integer.toString(status.statusCode)
                        if (status.error) info.log "pubNub.publish Error: " + status.errorData.information
                        else if (result.hasProperty("timetoken") && result.timetoken != null) log.info "pubnub publish success, timetoken: " + Long.toString(result.timetoken)
                    }
                }) 
            }
            if(data.press){
                channel = data.press+'_cacheInvalidate'
                log.info "send Bookings Cache invalidate in cachingService press:" + channel + " data > " + data
                pubnub.publish().message(data.booking + " (look " + data.look + ")").channel(channel).async(new PNCallback<PNPublishResult>() {
                    @Override
                    public void onResponse(PNPublishResult result, PNStatus status) {
                        log.info "pubnub sampleRequestCacheInvalidate publish status code: " + Integer.toString(status.statusCode)
                        if (status.error) info.log "pubNub.publish Error: " + status.errorData.information
                        else if (result.hasProperty("timetoken") && result.timetoken != null) log.info "pubnub publish success, timetoken: " + Long.toString(result.timetoken) 
                    }
                }) 
            }
            if(data.prAgency){
                channel = data.prAgency+'_cacheInvalidate'
                log.info "send Bookings Cache invalidate in cachingService prAgency:" + channel + " data > " + data
                pubnub.publish().message(data.booking + " (look " + data.look + ")").channel(channel).async(new PNCallback<PNPublishResult>() {
                    @Override
                    public void onResponse(PNPublishResult result, PNStatus status) {
                        log.info "pubnub sampleRequestCacheInvalidate publish status code: " + Integer.toString(status.statusCode)
                        if (status.error) info.log "pubNub.publish Error: " + status.errorData.information
                        else if (result.hasProperty("timetoken") && result.timetoken != null) log.info "pubnub publish success, timetoken: " + Long.toString(result.timetoken) 
                    }
                }) 
            }
        } catch(Exception e){
            log.error "Exception in CachingService - sample Request Cache Invalidate"
            log.error e.message
        }
    }

    @Selector('trolleyCacheInvalidate')
    void trolleyCacheInvalidate(Object data){
        Thread.sleep(2000);
        log.info "trolley CacheInvalidate sample data " + data
        try{
            def channel
            if(data.brand){
                channel = data.brand+'_trolleyCacheInvalidate'
                log.info "send Bookings Cache invalidate in cachingService Brand:" + channel + " data > " + data
                // channel = company name
                // data.booking = SR id
                // data.look = look id (name)
                pubnub.publish().message(data.booking + " (look " + data.look + ")").channel(channel).async(new PNCallback<PNPublishResult>() {
                    @Override
                    public void onResponse(PNPublishResult result, PNStatus status) {
                        log.info "pubnub sampleRequestCacheInvalidate publish status code: " + Integer.toString(status.statusCode)
                        if (status.error) info.log "pubNub.publish Error: " + status.errorData.information
                        else if (result.hasProperty("timetoken") && result.timetoken != null) log.info "pubnub publish success, timetoken: " + Long.toString(result.timetoken)
                    }
                }) 
            }
            if(data.press){
                channel = data.press+'_trolleyCacheInvalidate'
                log.info "send Bookings Cache invalidate in cachingService press:" + channel + " data > " + data
                pubnub.publish().message(data.booking + " (look " + data.look + ")").channel(channel).async(new PNCallback<PNPublishResult>() {
                    @Override
                    public void onResponse(PNPublishResult result, PNStatus status) {
                        log.info "pubnub sampleRequestCacheInvalidate publish status code: " + Integer.toString(status.statusCode)
                        if (status.error) info.log "pubNub.publish Error: " + status.errorData.information
                        else if (result.hasProperty("timetoken") && result.timetoken != null) log.info "pubnub publish success, timetoken: " + Long.toString(result.timetoken) 
                    }
                }) 
            }
            if(data.prAgency){
                channel = data.prAgency+'_trolleyCacheInvalidate'
                log.info "send Bookings Cache invalidate in cachingService prAgency:" + channel + " data > " + data
                pubnub.publish().message(data.booking + " (look " + data.look + ")").channel(channel).async(new PNCallback<PNPublishResult>() {
                    @Override
                    public void onResponse(PNPublishResult result, PNStatus status) {
                        log.info "pubnub sampleRequestCacheInvalidate publish status code: " + Integer.toString(status.statusCode)
                        if (status.error) info.log "pubNub.publish Error: " + status.errorData.information
                        else if (result.hasProperty("timetoken") && result.timetoken != null) log.info "pubnub publish success, timetoken: " + Long.toString(result.timetoken) 
                    }
                }) 
            }
        } catch(Exception e){
            log.error "Exception in CachingService - sample Request Cache Invalidate"
            log.error e.message
        }
    }

    @Selector('stuartOneHourNotification')
    void stuartOneHourNotification(Object data){
        Thread.sleep(2000)
        log.info "stuartOneHourNotification sample data " + data
        try{
            def channel
            if(data.brand){
                channel = data.brand+'_stuartOneHourNotification'
                log.info "send Bookings Cache invalidate in cachingService:" + channel + " data > " + data
                // channel = company name
                // data.booking = SR id
                // data.look = look id (name)
                pubnub.publish().message("Courier for request " + data.booking + " due in an hour.").channel(channel).async(new PNCallback<PNPublishResult>() {
                    @Override
                    public void onResponse(PNPublishResult result, PNStatus status) {
                        log.info "pubnub stuartOneHourNotification publish status code: " + Integer.toString(status.statusCode)
                        if (status.error) info.log "pubNub.publish Error: " + status.errorData.information
                        else if (result.hasProperty("timetoken") && result.timetoken != null) log.info "pubnub publish success, timetoken: " + Long.toString(result.timetoken) 
                    }
                }) 
            }
            if(data.press){
                channel = data.press+'_stuartOneHourNotification'
                log.info "send Bookings Cache invalidate in cachingService:" + channel + " data > " + data
                pubnub.publish().message("Courier for request " + data.booking + " due in an hour.").channel(channel).async(new PNCallback<PNPublishResult>() {
                    @Override
                    public void onResponse(PNPublishResult result, PNStatus status) {
                        log.info "pubnub stuartOneHourNotification publish status code: " + Integer.toString(status.statusCode)
                        if (status.error) info.log "pubNub.publish Error: " + status.errorData.information
                        else if (result.hasProperty("timetoken") && result.timetoken != null) log.info "pubnub publish success, timetoken: " + Long.toString(result.timetoken)
                    }
                })
            }
            if(data.prAgency){
                channel = data.prAgency+'_stuartOneHourNotification'
                log.info "send Bookings Cache invalidate in cachingService:" + channel + " data > " + data
                pubnub.publish().message("Courier for request " + data.booking + " due in an hour.").channel(channel).async(new PNCallback<PNPublishResult>() {
                    @Override
                    public void onResponse(PNPublishResult result, PNStatus status) {
                        log.info "pubnub stuartOneHourNotification publish status code: " + Integer.toString(status.statusCode)
                        if (status.error) info.log "pubNub.publish Error: " + status.errorData.information
                        else if (result.hasProperty("timetoken") && result.timetoken != null) log.info "pubnub publish success, timetoken: " + Long.toString(result.timetoken) 
                    }
                })
            }
        } catch(Exception e){
            log.error "Exception in CachingService - _stuartOneHourNotification"
            log.error e.message
        }
    }

    @Selector('connectionsUpdateNoPubNub')
    void invalidateConnections(Object data){
        log.info "UPDATING CONNECTIONS No Pubnub "
        String newValue = loadConnections()
        connections = newValue

    }

    def connections(){
        log.info "connections() checking connections:"
        if(connections == null){
            def result = loadConnections()
            connections = result
            return result
        }
        log.info "connections() Connections not null, returning existing connections"
        connections

    }
    def themes(){
        if(!themes){
            def result = loadThemes()
            themes = result
            return result
        }
        themes
    }
    

    def loadThemes(){
        
        def items = ['ANIMAL','ARMY','ART','ATHLETIC','AVIATOR','BABYDOLL','BALLERINA','BAROQUE','BIKER','BOHEMIAN','CAMOUFLAGE','CHECK','CIRCUS','COWBOY','DANCE','DESTROY','DETECTIVE','DISCO','DOLL','DOMINATRIX','ETHNIC','FAIRY','FLAMENCO','FOLK','FOLKLORIC','FUNK','FUTURISTIC','GIRLY','GRAPHIC','GRUNGE','HIPPY','JUNGLE','MASCULINE','MERMAID','MILITARY','MINIMAL','OFFICER','ORIENTAL','POP','PRINCESS','PSYCHEDELIC','PUNK','REBEL','RETRO','ROCK','ROMANTIC','ROYAL','RURAL','SAFARI','SAILOR','SPORT','STAR','STUDIO 54','TEENAGER','URBAN','UTILITY','VICTORIAN','VINTAGE','VINYL','WARRIOR','WESTERN']
        
        
        return items as JSON
    }


    def loadConnections(){
        def list = User.list()
        log.info ""
        log.info "loadConnections() ***************   Connections Rendering in Service ********************"
        JsonRenderResult renderResult = render(template: "/user/connections", model:[userList: list])
        log.info "Rendered Connections in service"
        String json = renderResult.jsonText
        json
    }

    


          
      
}
