package pashion

import grails.test.mixin.*
import spock.lang.*

@TestFor(PressHouseController)
@Mock(PressHouse)
class PressHouseControllerSpec extends Specification {

    def populateValidParams(params) {
        assert params != null

        // TODO: Populate valid properties like...
        //params["name"] = 'someValidName'
        assert false, "TODO: Provide a populateValidParams() implementation for this generated test suite"
    }

    void "Test the index action returns the correct model"() {

        when:"The index action is executed"
            controller.index()

        then:"The model is correct"
            !model.pressHouseList
            model.pressHouseCount == 0
    }

    void "Test the create action returns the correct model"() {
        when:"The create action is executed"
            controller.create()

        then:"The model is correctly created"
            model.pressHouse!= null
    }

    void "Test the save action correctly persists an instance"() {

        when:"The save action is executed with an invalid instance"
            request.contentType = FORM_CONTENT_TYPE
            request.method = 'POST'
            def pressHouse = new PressHouse()
            pressHouse.validate()
            controller.save(pressHouse)

        then:"The create view is rendered again with the correct model"
            model.pressHouse!= null
            view == 'create'

        when:"The save action is executed with a valid instance"
            response.reset()
            populateValidParams(params)
            pressHouse = new PressHouse(params)

            controller.save(pressHouse)

        then:"A redirect is issued to the show action"
            response.redirectedUrl == '/pressHouse/show/1'
            controller.flash.message != null
            PressHouse.count() == 1
    }

    void "Test that the show action returns the correct model"() {
        when:"The show action is executed with a null domain"
            controller.show(null)

        then:"A 404 error is returned"
            response.status == 404

        when:"A domain instance is passed to the show action"
            populateValidParams(params)
            def pressHouse = new PressHouse(params)
            controller.show(pressHouse)

        then:"A model is populated containing the domain instance"
            model.pressHouse == pressHouse
    }

    void "Test that the edit action returns the correct model"() {
        when:"The edit action is executed with a null domain"
            controller.edit(null)

        then:"A 404 error is returned"
            response.status == 404

        when:"A domain instance is passed to the edit action"
            populateValidParams(params)
            def pressHouse = new PressHouse(params)
            controller.edit(pressHouse)

        then:"A model is populated containing the domain instance"
            model.pressHouse == pressHouse
    }

    void "Test the update action performs an update on a valid domain instance"() {
        when:"Update is called for a domain instance that doesn't exist"
            request.contentType = FORM_CONTENT_TYPE
            request.method = 'PUT'
            controller.update(null)

        then:"A 404 error is returned"
            response.redirectedUrl == '/pressHouse/index'
            flash.message != null

        when:"An invalid domain instance is passed to the update action"
            response.reset()
            def pressHouse = new PressHouse()
            pressHouse.validate()
            controller.update(pressHouse)

        then:"The edit view is rendered again with the invalid instance"
            view == 'edit'
            model.pressHouse == pressHouse

        when:"A valid domain instance is passed to the update action"
            response.reset()
            populateValidParams(params)
            pressHouse = new PressHouse(params).save(flush: true)
            controller.update(pressHouse)

        then:"A redirect is issued to the show action"
            pressHouse != null
            response.redirectedUrl == "/pressHouse/show/$pressHouse.id"
            flash.message != null
    }

    void "Test that the delete action deletes an instance if it exists"() {
        when:"The delete action is called for a null instance"
            request.contentType = FORM_CONTENT_TYPE
            request.method = 'DELETE'
            controller.delete(null)

        then:"A 404 is returned"
            response.redirectedUrl == '/pressHouse/index'
            flash.message != null

        when:"A domain instance is created"
            response.reset()
            populateValidParams(params)
            def pressHouse = new PressHouse(params).save(flush: true)

        then:"It exists"
            PressHouse.count() == 1

        when:"The domain instance is passed to the delete action"
            controller.delete(pressHouse)

        then:"The instance is deleted"
            PressHouse.count() == 0
            response.redirectedUrl == '/pressHouse/index'
            flash.message != null
    }
}
