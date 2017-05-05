package pashion

import com.agileorbit.schwartz.SchwartzJob
import grails.transaction.Transactional

import groovy.util.logging.Slf4j
import org.quartz.JobExecutionContext
import org.quartz.JobExecutionException
import groovy.time.TimeCategory
import org.hibernate.FetchMode as FM


@Slf4j
class StuartNotificationJobService implements SchwartzJob {

	def emailService

	@Transactional
	void execute(JobExecutionContext context) throws JobExecutionException {
		println "Stuart Notification JobService"
		
		Date today = new Date().clearTime()
		Date now = new Date()
		Date inOneHour

		use(TimeCategory) {
        	inOneHour = today + 1.hours 
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
		results.each{
			//if they are happening in the next hour then notify them
			Date theirTime
			use(TimeCategory){
				
				def timeArray = it.pickupTime.split(":")
        		theirTime = today + timeArray[0].toInteger().hours + timeArray[1].toInteger().minutes
        		if(theirTime.after(now) && theirTime.before(inOneHour)){
        			it << listToNotify 
        		}
			}
		}
		println "courier out notifications: "+listToNotify.size()
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
			Date theirTime
			use(TimeCategory){
				
				def timeArray = it.pickupReturnTime.split(":")
        		theirTime = today + timeArray[0].toInteger().hours + timeArray[1].toInteger().minutes
        		if(theirTime.after(now) && theirTime.before(inOneHour)){
        			it << listToNotify 
        		}
			}
		}
		//emailService.courierReturnNotify(listToNotify)

      
	}


	void buildTriggers() {
		triggers << factory('Stuart_EverySecond').intervalInSeconds(100).build()
	}
}
