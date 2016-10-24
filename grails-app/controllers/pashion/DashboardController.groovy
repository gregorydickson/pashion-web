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

    def itemTypes(){
        //quick list to get UI going
        def itemTypes = SearchableItemType.list() as JSON
        render itemTypes
    }

    def colors(){
        def colors = ['baby blue','beige','bicolour','black','bleu','blue','bordeaux',
                'bright','bronze','burgundy','camel','cobalt','cognac','colorful',
                'coral','cream','fuschia','glitter','gold','gray','green','grey','jaune',
                'khaki','lavendar','light blue','lilac','lime','metallic','monochrome',
                'multicolour','mustard','navy','noir','nude','orange','pastel','pearl',
                'pink','powder','purple','red','rust','shine','silver','transparence',
                'turquoise','white','yellow'] as JSON
        render colors
    }
    def seasons(){
        //quick list to get UI going
        def seasons = Season.list().collect{it.name} as JSON
        render seasons
    }

    def returnBy(){
    	def list = ['Morning','Noon','Afternoon'] as JSON
    	render list
    }

    def type(){
        render SearchableItemType as JSON
    }
    def deliverTo(){
    	render User.list() as JSON
    }

    def returnTo(){
        render User.list() as JSON
    }

    def renderLook() {
        //use the custom JSON marshaller defined in Boostrap.groovy
        // instead of json view
        def item = SearchableItem.get(params.id.toInteger())
        
        render item as JSON
        
    }
}
