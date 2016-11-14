package pashion

import grails.converters.JSON

class DashboardController {
    static scope = "singleton"

    def index() {
       

    }

     def user(){
        if(!session.user){
            def info = [type:'guest' ] as JSON
            render info 
            return
        }
        
        def user = session.user
        def type
        if(user.brand){
            type = 'brand'
        }else{
            type = 'press'
        }
        //creating a map is more simple than a bunch of marshalling code
        def userInfo = [email:user.email,type:type,name:user.name,surname:user.surname ] as JSON
        render userInfo
     }


    def required(){
    	def list = ['9:00','9:30','10:00','10:30','11:00','11:30',
    				'12:00','12:30','13:00','13:30','14:00','14:30',
    				'15:00','15:30','16:00','16:30','17:00'] as JSON
    	render list
    }

    def cities(){
        def list = ['London','Paris','Madrid','Milan'] as JSON
        render list
    }

    def material(){
        def list = ['CASHMERE','CORDUROY','CREPE','CUIR','DENIM','DUNGAREE','FLUFFY',
                    'FRILL','FUR','GLITTER','JOUY','KNIT','LACE','LAMÉ','LEATHER','LINEN',
                    'METAL','MOHAIR','ORGANZA','OXFORD','PAISLEY','PLAID','PLASTIC','PVC',
                    'QUILT','RIB','SHEARLING','SHEEP','SILK','SNAKE','SNAKESKIN','STITCH',
                    'TARTAN','TULLE','TWEED','VELVET','WATERPROOF','WOOL','WRAP'] as JSON
        render list
    }

    def theme(){
        def list = ['ALIEN','ALPINA','ANDROGYNE','ANDROGYNOUS','ANIMAL','ARCHITECTURE',
                    'ARMY','ART','AVIATION','AVIATOR','BABY','BALLET','BARBIE','BAROQUE',
                    'BOARD','BOMBER','BOUDOIR','BRIDAL','CABLE','CIRCUS','CLEAVAGE',
                    'CLUELESS','COWBOY','DISCO','DOLL','DOMINATRIX','FAIRY','FAIRYTALE',
                    'FISHNET','FLORAL','FLOWER','FUTURIST','FUTURISTIC','GRAPHIC','HUNT',
                    'JAMES BOND','JUNGLE','MANGA','MUSIC','NATURE','NAUTICAL','NAVY',
                    'OLYMPIC','OPULENT','POP','POWER','PRINCESS','PSYCHEDELIC','PURE',
                    'RETRO','ROBOT','ROYAL','S&M','SAFARI','SALSA','SCHOOL','SEA','SEXY',
                    'SPACE','STAR','STUDIO 54','TEXTURE','TRANSPARENT','TROPICAL','TUDOR',
                    'UTILITY','VICTORIAN','VINYL','WARRIOR','WESTERN','ZIGGY'] as JSON
        render list
    }

    def sampleTypes(){

        def list = ['bikini','blazer','blouse','body','boyfriend jeans','boots','bra',
                    'bustier','cape','cardigan','coat','cocktail dress','corsage','corset',
                    'costume','culotte','dress','dressing gown','dungarees','flared jeans',
                    'gilet','gown','hoodie','jacket','jean','jeggings','jogging','jumper',
                    'jumpsuit','jupe','kilt','kimono','laysuit','legging','lingerie','mao',
                    'nightgown','nightwear','overalls','oxford','pajama','pants','parka',
                    'pantyhose','pensil skirt','perfecto','platform boots','pocket','polo',
                    'poncho','puffer','pyjama','raincoat','reefer','scarf','shirt',
                    'shirt dress','shorts','skirt','skirt dress','sleeve','sleeveless',
                    'slip','slip dress','smoking','stilletos','suit','sweater','sweatpants',
                    'sweatshirt','teeshirt','tennis','top','trench','trenchcoat','trousers',
                    'turtleneck','tuxedo','vest','waistcoat'] as JSON
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

    def courier(){
        def list = ['Stuart: Bike','Stuart: Car','Stuart: Foot',
                        'Stuart: Scooter', 'My Courier'] as JSON
        render list
    }

    def payment(){
        def list = ['50/50','We Pay','They Pay'] as JSON
        render list
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
