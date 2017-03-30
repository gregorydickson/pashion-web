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

@Transactional
@Consumer
class CachingService implements JsonViewTest {

    static lazyInit = false
    static scope = "singleton"
    
    def seasons
    def themes
    String connections = null

    Pubnub pubnub = null

    @PostConstruct
    void init() {
        pubnub = new Pubnub("pub-c-b5b66a91-2d36-4cc1-96f3-f33188a8cc73", "sub-c-dd158aea-b76b-11e6-b38f-02ee2ddab7fe")
    }

    @Selector('connectionsUpdate')
    void invalidateConnectionsPubNub(Object data){
        log.info "UPDATING CONNECTIONS "
        String newValue = loadConnections()
        connections = newValue
        Callback callback=new Callback() {}
        def channel = data + '_cacheInvalidate'
        log.info "send invalidate in cachingService:invalidateConnectionsPubNub on:" + channel
        pubnub.publish(channel, "connections" , callback)

    }

    @Selector('sampleRequestCacheInvalidate')
    void sampleRequestCacheInvalidate(Object data){
        try{
            Callback callback=new Callback() {}
            def channel
            if(data.brand){
                channel = data.brand+'_cacheInvalidate'
                log.info "send Bookings Cache invalidate in cachingService:" + channel
                pubnub.publish(channel,data.booking , callback)
            }
            if(data.press){
                channel = data.press+'_cacheInvalidate'
                log.info "send Bookings Cache invalidate in cachingService:" + channel
                pubnub.publish(channel,data.booking, callback)
            }
        } catch(Exception e){
            log.error "Exception in CachingService - sample Request Cache Invalidate"
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
    def seasons(){
        if(!seasons){
            def result = loadSeasons()
            seasons = result
            return result
        }
        seasons
    }

    def loadThemes(){
        
        def items = ['ANIMAL','ARMY','ART','ATHLETIC','AVIATOR','BABYDOLL','BALLERINA','BAROQUE','BIKER','BOHEMIAN','CAMOUFLAGE','CHECK','CIRCUS','COWBOY','DANCE','DESTROY','DETECTIVE','DISCO','DOLL','DOMINATRIX','ETHNIC','FAIRY','FLAMENCO','FOLK','FOLKLORIC','FUNK','FUTURISTIC','GIRLY','GRAPHIC','GRUNGE','HIPPY','JUNGLE','MASCULINE','MERMAID','MILITARY','MINIMAL','OFFICER','ORIENTAL','POP','PRINCESS','PSYCHEDELIC','PUNK','REBEL','RETRO','ROCK','ROMANTIC','ROYAL','RURAL','SAFARI','SAILOR','SPORT','STAR','STUDIO 54','TEENAGER','URBAN','UTILITY','VICTORIAN','VINTAGE','VINYL','WARRIOR','WESTERN']
        
        
        return items as JSON
    }

    def loadSeasons(){
        List items = SearchableItem.list().collect{it.season}

        items.unique()
        log.info"seasons"+items
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
