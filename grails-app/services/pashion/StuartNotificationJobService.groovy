package pashion

import com.agileorbit.schwartz.SchwartzJob
import grails.transaction.Transactional

import groovy.util.logging.Slf4j
import java.util.TimeZone
import org.quartz.JobExecutionContext
import org.quartz.JobExecutionException
import groovy.time.TimeCategory
import org.hibernate.FetchMode as FM


@Slf4j
class StuartNotificationJobService implements SchwartzJob {

	def emailService

	@Transactional
	void execute(JobExecutionContext context) throws JobExecutionException {
		//println "STUART NOTIFICAION  ******   Stuart Notification JobService"
		TimeZone.setDefault(TimeZone.getTimeZone("UTC"))
		
		Date today = new Date().clearTime()
		Date now = new Date()
		//println "STUART NOTIFICAION  ******  now "+now

		Date inOneHour

		use(TimeCategory) {
        	inOneHour = now + 1.hours 
        	//println "STUART NOTIFICAION  ******  in OneHour "+inOneHour
        }
        
        def query = SampleRequest.createCriteria() 

        // SHIPPING OUT
        // first find any shipping out for today's date
        // that have not been notified
        List results = query.listDistinct (){
        	fetchMode 'shippingOut', FM.JOIN

    		shippingOut{
    			eq('stuartStatus','scheduled')
    		}
    		eq('pickupDate',today)
    		eq('courierOutNotification',false)
        }
 
		
		def listToNotify = []
		results.each{ SampleRequest sr ->
			//if they are happening in the next hour then notify them
			//println "STUART NOTIFICAION  ******   a Shipping Out:"+sr
			Date theirTime
			use(TimeCategory){
				
				def timeArray = sr.pickupTime.split(":")
        		theirTime = today + timeArray[0].toInteger().hours + timeArray[1].toInteger().minutes
        		//println "STUART NOTIFICAION  ******  sr pickup time: "+theirTime
        		if(theirTime < inOneHour && theirTime > now ){
        			//println "STUART NOTIFICAION  ******   a Shipping Out in the next Hour:"+it
        			listToNotify << sr
        			sr.courierOutNotification = true
        			sr.save(flush:true, failOnError:true)
        		}
			}
		}
		//println "STUART NOTIFICAION  ******   courier out notifications: "+listToNotify.size()
		if(listToNotify.size() > 0) emailService.courierOutNotify(listToNotify)

		// TODO notify return
		// SHIPPING RETURN ***************************************
		// find any shipping return that have not been notified
		def newQuery = SampleRequest.createCriteria() 
        List results2 = newQuery.listDistinct (){
        	fetchMode 'shippingReturn', FM.JOIN

    		shippingReturn{
    			eq('stuartStatus','scheduled')
    		}
    		eq('pickupDateReturn',today)
    		eq('courierReturnNotification',false)
        }
		def listToNotify2 = []
		results2.each{
			//if they are happening in the next hour then notify them
			//println "STUART NOTIFICAION  ******   a Shipping Return:"+it
			Date theirTime
			use(TimeCategory){
				
				def timeArray = it.pickupReturnTime.split(":")
        		theirTime = today + timeArray[0].toInteger().hours + timeArray[1].toInteger().minutes
        		if(theirTime.after(now) && theirTime.before(inOneHour)){
        			//println "STUART NOTIFICAION  ******   a Shipping Return in the next Hour:"+it
        			it << listToNotify 
        		}
			}
		}
		//emailService.courierReturnNotify(listToNotify)

      
	}


	void buildTriggers() {
		triggers << factory('Stuart_EverySecond').intervalInSeconds(60).build()
	}
}
