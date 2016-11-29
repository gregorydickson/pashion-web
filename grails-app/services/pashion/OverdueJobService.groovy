package pashion

import com.agileorbit.schwartz.SchwartzJob
import grails.transaction.Transactional

import groovy.util.logging.Slf4j
import org.quartz.JobExecutionContext
import org.quartz.JobExecutionException
import groovy.time.TimeCategory




@Slf4j
class OverdueJobService implements SchwartzJob {

	@Transactional
	void execute(JobExecutionContext context) throws JobExecutionException {
		println "OverdueJobService"
		Date today = new Date().clearTime()
		Date lastTimeToday

		use(TimeCategory) {
                lastTimeToday = today + 23.hours + 59.minutes
        }
        List stati = ['Out','stet','Returning','Picking Up','Picked Up']




        List<SampleRequest> requests = SampleRequest.findAllByBookingEndDateBetweenAndRequestStatusBrandInList(
                    today,
                    lastTimeToday,
                    stati)
		
		requests*.overdue = true
		requests*.save(flush:true)
		 
	}

	void buildTriggers() {
		triggers << factory('cron every two hours').cronSchedule('0 0 0/2 * * ?').build()
		//triggers << factory('cron every second').cronSchedule('0/1 * * * * ?').build()

		
	}
}
