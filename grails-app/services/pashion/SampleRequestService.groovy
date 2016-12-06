package pashion

import grails.transaction.Transactional
import org.grails.web.json.JSONObject
import java.text.SimpleDateFormat

@Transactional
class SampleRequestService {

    String dateFormatString = "yyyy-M-d"

    def listByUserOrganization(User user) {
    	def criteria = SampleRequest.createCriteria()
        List results = []

        if(user?.brand){
            log.info "brand user get sample requests"
            def brand = user.brand
            results = criteria.listDistinct () {
                eq('brand',brand)
            }
        }
        if(user?.pressHouse){
            log.info "press user get sample requests"
            def pressHouse = user.pressHouse
            results = criteria.listDistinct () {
                eq('pressHouse',pressHouse)
            }
        }
        results
    }

    def updateSampleRequest(JSONObject jsonObject){
            SimpleDateFormat dateFormat =  new SimpleDateFormat(dateFormatString)
            
            log.info "update json:"+jsonObject
            SampleRequest sr = SampleRequest.get(jsonObject.id)
            sr.editorialName = jsonObject.editorialName
            sr.editorialWho = jsonObject.editorialWho
            if(jsonObject.editorialWhen) 
                sr.editorialWhen = dateFormat.parse(jsonObject.editorialWhen)
            sr.deliverTo = User.get(jsonObject.deliverTo.id)

            sr.shippingOut.tracking = jsonObject.shippingOut.tracking
            sr.shippingReturn.tracking = jsonObject.shippingReturn.tracking
            //remove samples from list - Press User
            jsonObject?.samplesRemoved?.each{ removed ->
                log.info "removing:"+removed
                def item = sr.searchableItems.find { it.id == removed }
                sr.removeFromSearchableItemsProposed(item)
            }
            //add approved samples to final list
            
            jsonObject.searchableItemsProposed.each{ sample ->
                
                def status = sr.searchableItemsStatus.find { it.itemId == sample.id }
                log.info "status:"+status
                if(status == "Approved"){
                    status.status = "Approved"
                    log.info "item status:"+status.status
                    status.save(failOnError:true)
                    def item = sr.searchableItems.find{it.id == sample.id}
                    if(!item){
                        sr.addToSearchableItems(sample)
                    }
                } else if(status == "Denied"){
                    status.status = "Denied"
                    log.info "item status:"+status.status
                    status.save(failOnError:true)
                }
            }
            
            sr.save(failOnError:true)
    }
}
