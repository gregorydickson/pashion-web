import grails.util.BuildSettings
import grails.util.Environment

// See http://logback.qos.ch/manual/groovy.html for details on configuration
appender('STDOUT', ConsoleAppender) {
    encoder(PatternLayoutEncoder) {
        pattern = "%level %logger - %msg%n"
    }
}



appender( 'LE', com.logentries.logback.LogentriesAppender){
   Token = "1267ef7c-b2d9-4314-9613-f38ef48ee7dd"
   Ssl = "false"
   facility = "USER"
   encoder(PatternLayoutEncoder) {
            pattern = "%d{EEE MMM dd HH:mm:ss ZZZ yyyy}:%msg%n"
        }
}

root(ERROR, ['STDOUT', 'LE'])



logger("org.quartz", INFO, ['STDOUT','LE'], false)
logger("grails.app.services", INFO, ['STDOUT','LE'], false)
logger("grails.app.controllers", DEBUG, ['STDOUT','LE'], false)
logger("grails.app.domain", DEBUG, ['STDOUT','LE'], false)
logger("asset.pipeline.jsass", INFO, ['STDOUT'], false)
logger("asset.pipeline", INFO, ['STDOUT'], false)
//logger("org.hibernate.cache", DEBUG, ["STDOUT"], false)
logger("grails.views", DEBUG, ["STDOUT"], false)

//logger("org.hibernate.SQL", DEBUG, ["STDOUT"], false)

def targetDir = BuildSettings.TARGET_DIR
if (Environment.isDevelopmentMode() && targetDir) {
    appender("FULL_STACKTRACE", FileAppender) {
        file = "${targetDir}/stacktrace.log"
        append = true
        encoder(PatternLayoutEncoder) {
            pattern = "%level %logger - %msg%n"
        }
    }
    logger("StackTrace", ERROR, ['FULL_STACKTRACE'], false)
}
