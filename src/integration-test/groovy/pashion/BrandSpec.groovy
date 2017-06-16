package pashion

import grails.test.mixin.integration.Integration
import grails.transaction.*

import spock.lang.*
import geb.spock.*

/**
 * See http://www.gebish.org/manual/current/ for more instructions
 */
@Integration
class BrandSpec extends GebSpec {

    def setup() {
    }

    def cleanup() {
    }

    

    void "Test the home page renders correctly"() {
        when:"The login page is visited"
            go '/user/login'
            waitFor(7, 1) {$("form").verifyNotEmpty()}

        then:"The title is correct"
            title == "User Login"

        when:"user logs in"
            $("form").with {
                email = "pacorabanne@pashiontool.com"
                password = "Pashion123"
                
            }
            $("input[type='submit']").click()
            
            
        then:"The application loads"
            waitFor(140,4){$("#mainScrollWindow").verifyNotEmpty()}
            title == "Dashboard | PASHION"

        //TODO: use click event if possible to actually test UI
        when:"select season"
            js.exec("window.jQuery('#seasonSelect').val('7').trigger('change');")

        then:
            //Thread.sleep(20000)
            waitFor(140,4){$("#image-3098").verifyNotEmpty()}

    }

    

    


}
