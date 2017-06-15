package pashion

import grails.test.mixin.integration.Integration
import grails.transaction.*

import spock.lang.*
import geb.spock.*

/**
 * See http://www.gebish.org/manual/current/ for more instructions
 */
@Integration
class LoginSpec extends GebSpec {

    def setup() {
    }

    def cleanup() {
    }

    /*void "test something"() {
        when:"The home page is visited"
            go '/user/login'
            
            
            $("form.login").with {
                email = "gregory@pashiontool.com"
                password = "Pashion123"
                login().click()
            }

        then:"The title is correct"
        	title == "Dashboard | PASHION"
    }*/

    void "Test the home page renders correctly"() {
        when:"The home page is visited"
            go '/user/login'
            waitFor(7, 1) {$("form").verifyNotEmpty()}

        then:"The title is correct"
            title == "User Login"

        when:"user logs in"
            $("form").with {
                email = "gregory@pashiontool.com"
                password = "Pashion123"
                submit()
            }
            waitFor(30,2){$(#ui-datepicker-div)}
            
        then:"The application loads"
            title == "Dashboard | PASHION"
    }


}
