package pashion

import grails.converters.JSON

class DashboardController {

    def index() { }

    def nav() {}

    def required(){
    	def list = ['9:00','9:30','10:00','10:30','11:00','11:30',
    				'12:00','12:30','13:00','13:30','14:00','14:30',
    				'15:00','15:30','16:00','16:30','17:00'] as JSON
    	render list
    }

    def returnBy(){
    	def list = ['Morning','Noon','Afternoon'] as JSON
    	render list
    }

    def deliverTo(){
    	SearchableItem item = SearchableItem.get(params.item)
    }
}
