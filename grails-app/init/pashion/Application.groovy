package pashion

import grails.boot.GrailsApp
import grails.boot.config.GrailsAutoConfiguration
import groovy.transform.CompileDynamic


import grails.util.*
import groovy.transform.InheritConstructors

class Application extends GrailsAutoConfiguration {
    static void main(String[] args) {
        GrailsApp.run(Application, args)
    }

}

@InheritConstructors
class StartupGrailsApp extends GrailsApp {
    @Override
    protected void logStartupInfo(boolean isRoot) {
        // Show default info.
        super.logStartupInfo(isRoot)
 
        // And add some extra logging information.
        // We use the same logger if we get the
        // applicationLog property.
        if (applicationLog.debugEnabled) {
            final metaInfo = Metadata.getCurrent()
            final String grailsVersion = GrailsUtil.grailsVersion
            applicationLog.debug "Running with Grails v${grailsVersion}"
 
            final sysprops = System.properties
            applicationLog.debug "Running on ${sysprops.'os.name'} v${sysprops.'os.version'}"
        }
        'say hello'.execute()
    }

    
}
