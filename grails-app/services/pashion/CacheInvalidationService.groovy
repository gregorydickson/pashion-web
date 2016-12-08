package pashion

import com.pubnub.api.*
import org.json.*
import javax.annotation.PostConstruct



class CacheInvaldationService {

    static lazyInit = false
    Pubnub pubnub
    @PostConstruct
    void init() {
          log.info "Cache Invalidation Service Initializing"
          pubnub = new Pubnub("demo", "demo");
    }



    def sampleRequests(){
        //send messages on sampleRequest channel
    }


          
      
}
