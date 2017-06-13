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
		println "STUART NOTIFICATION LONDON  ******   Stuart Notification JobService"
		

		TimeZone.setDefault(TimeZone.getTimeZone("Europe/London"))
		Date today = new Date().clearTime()
		Date now = new Date()
		println "STUART NOTIFICATION LONDON ******  now "+now

		Date inOneHour
		use(TimeCategory) {
        	inOneHour = now + 1.hours 
        	println "STUART NOTIFICATION LONDON  ******  in OneHour "+inOneHour
        }
        
        

        // SHIPPING OUT
        // first find any shipping out for today's date
        // that have not been notified
        def query = SampleRequest.createCriteria()
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
			println "STUART NOTIFICATION LONDON  ******   a Shipping Out:"+sr
			Date theirTime
			use(TimeCategory){
				
				def timeArray = sr.pickupTime.split(":")
        		theirTime = today + timeArray[0].toInteger().hours + timeArray[1].toInteger().minutes
        		println "STUART NOTIFICATION LONDON  ******  sr pickup time: "+theirTime
        		if(theirTime < inOneHour && theirTime > now ){
        			println "STUART NOTIFICATION LONDON  ******   a Shipping Out in the next Hour:"+it
        			listToNotify << sr
        		}
			}
		}
		println "STUART NOTIFICATION LONDON  ******   courier out notifications: "+listToNotify.size()
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

        listToNotify = []
		results2.each{ SampleRequest sr ->
			//if they are happening in the next hour then notify them
			println "STUART NOTIFICATION LONDON  ******   a Shipping Return:"+sr
			Date theirTime
			use(TimeCategory){
				
				def timeArray = sr.pickupTime.split(":")
        		theirTime = today + timeArray[0].toInteger().hours + timeArray[1].toInteger().minutes
        		println "STUART NOTIFICATION LONDON  ******  sr pickup time: "+theirTime
        		if(theirTime < inOneHour && theirTime > now ){
        			println "STUART NOTIFICATION LONDON  ******   a Shipping Return in the next Hour:"+it
        			listToNotify << sr
        		}
			}
		}
		println "STUART NOTIFICATION LONDON  ******   courier return notifications: "+listToNotify.size()
		
		if(listToNotify.size() > 0) emailService.courierReturnNotify(listToNotify)

      
	}


	void buildTriggers() {
		triggers << factory('Stuart_EverySecond').intervalInSeconds(60).build()
	}
}
