package pashion

import grails.converters.JSON
import java.util.concurrent.ThreadLocalRandom

class DashboardController {
    static scope = "session"

    def cachingService

    def index() {
    }

    def user(){
        def info
        if(session.user == null){
            info = [type:'guest' ] as JSON
            session.user = 'guest'
            render info 
            return
        } else if(session.user == 'guest'){
            info = [type:'guest' ] as JSON
            render info 
            return
        }

        def user = session.user
        log.info "user:"+user
        def type
        def companyId
        if(user.brand){
            type = 'brand'
            companyId = user.brand.id
        } else if (user.pressHouse) {
            type = 'press'
            companyId = user.pressHouse.id
        } else if (user.prAgency) {
            type = 'prAgency'
            companyId = user.prAgency.id
        } else {
            type = 'guest'
        }
        //creating a map is more simple than a bunch of marshalling code
        def userInfo = [email:user.email,id:user.id, type:type,companyId:companyId, name:user.name,surname:user.surname ] as JSON
        render userInfo
    }

    def users(){
        
        def users = user.list() as JSON
        render users
    }

    def usersBrand(){
        def company = Brand.get(params.id.toInteger())
        def users = company.users as JSON
        render users
    }
    def usersPressHouse(){

        def company = PressHouse.get(params.id.toInteger())
        def users = company.users as JSON
        render users
    }

    def usersPRAgency(){
        def company = PRAgency.get(params.id.toInteger())
        def users = company.users as JSON
        render users
        
    }



    def required(){
    	def list = ['9:00','9:30','10:00','10:30','11:00','11:30',
    				'12:00','12:30','13:00','13:30','14:00','14:30',
    				'15:00','15:30','16:00','16:30','17:00'] as JSON
    	render list
    }

    def cities(){
        def list = ['London','Paris','Milan', 'New York'] as JSON
        render list
    }

    def material(){
        def list = ['CASHMERE','CLOTH','COTTON','CORDUROY','CREPE','CUIR','DENIM','DUNGAREE','FLUFFY',
                    'FRILL','FUR','GLITTER','JOUY','KNIT','LACE','LAMÉ','LEATHER','LINEN',
                    'METAL','MOHAIR','ORGANZA','OXFORD','PAISLEY','PLAID','PLASTIC','PVC',
                    'QUILT','RIB','SHEARLING','SHEEP','SILK','SNAKE','SNAKESKIN','STITCH',
                    'TARTAN','TULLE','TWEED','VELVET','WATERPROOF','WOOL','WRAP'] as JSON
        render list
    }

    def themes(){
        def list = cachingService.themes() 
        render list
    }

    def sampleTypes(){

        def list = ['bag','belt','bikini','blazer','blouse','body','boyfriend jeans','boots','bra',
                    'bustier','cape','cardigan','coat','cocktail dress','corsage','corset',
                    'costume','culotte','dress','dressing gown','dungarees','flared jeans',
                    'gilet','glasses','gown','hat','hoodie','jacket','jean','jeggings','jogging','jumper',
                    'jumpsuit','jupe','kilt','kimono','laysuit','legging','lingerie','mao',
                    'nightgown','nightwear','overalls','oxford','pajama','pants','parka',
                    'pantyhose','pensil skirt','perfecto','platform boots','pocket','polo',
                    'poncho','puffer','pyjama','raincoat','reefer','satchel','sandal','scarf','shoes','shirt',
                    'shirt dress','shorts','skirt','skirt dress','sleeve','sleeveless',
                    'slip','slip dress','smoking','stilletos','suit','sunglasses','sweater','sweatpants',
                    'sweatshirt','teeshirt','tennis','top','trench','trenchcoat','trousers',
                    'turtleneck','tuxedo','vest','waistcoat'] as JSON
        render list
    }

    def itemTypes(){
        
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
        
        def seasons = cachingService.seasons()

        if(!seasons)
            seasons = Season.list().collect{it.name} as JSON

        render seasons
    }

    def returnBy(){
    	def list = ['Morning','Noon','Afternoon'] as JSON
    	render list
    }

    def courier(){
        def list = ['Bike','Car','Foot',
                        'Scooter', 'My Courier'] as JSON
        render list
    }

    def payment(){
        def list = ['50/50','We Pay','They Pay'] as JSON
        render list
    }

    def keywords(){
        def number = ThreadLocalRandom.current().nextInt(1, 11)
        def list
        switch(number){
            case 1:
                list = ["parka"]
                break
            case 2:
                list = ["shoes dress"]
                break
            case 3:
                list = ["hat"]
                break
            case 4:
                list = ["boots"]
                break
            case 5:
                list = ["coat"]
                break
            case 6:
                list = ["hoodie"]
                break
            case 7:
                list = ["suit"]
                break
            case 8:
                list = ["sweater"]
                break
            case 9:
                list = ["trousers"]
                break
            case 10:
                list = ["teeshirt"]
                break
        }
        render list as JSON
    }

    def type(){
        render SearchableItemType as JSON
    }

    def deliverTo(){
        def press = session.user.pressHouse
        def brand = session.user.brand
        def users
        if(press){
            users = User.findAllByPressHouse(press)
        } else{
            users = User.findAllByBrand(brand)
        }

    	render users as JSON
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
