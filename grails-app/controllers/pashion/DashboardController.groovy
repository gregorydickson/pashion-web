package pashion

import grails.converters.JSON
import java.util.concurrent.ThreadLocalRandom

class DashboardController {
    static scope = "session"

    def cachingService

    def index() {
    }

    def citiesObjects(){
        def cities = City.list() as JSON
        render cities
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
        def list = ['CASHMERE','CHAMBRAY','CLOTH','COTTON','CORDUROY','CREPE','CUIR','DENIM','DUNGAREE','FISHNET','FLUFFY',
                    'FRILL','FUR','GLITTER','JOUY','KNIT','LACE','LAMÉ','LEATHER','LINEN',
                    'METAL','MOHAIR','ORGANZA','OXFORD','PAISLEY','PLAID','PLASTIC','PVC',
                    'QUILT','RIB','SATIN','SHEARLING','SHEEP','SHEER','SILK','SNAKE','SNAKESKIN','STITCH','SUEDE',
                    'TARTAN','TULLE','TWEED','VELVET','WATERPROOF','WOOL','WRAP'] as JSON
        render list
    }

    def themes(){
        def list = cachingService.themes() 
        render list
    }

    def sampleTypes(){

        def list = ['bag','babouches','bandana','beads','belt','bermuda','bikini','blazer','blouse','bodice','boots','boyfriend jeans','bomber jacket','boots','bra','bracelet',
                    'braces','bustier','button','cap','cape','cardigan','claudine','coat','cocktail dress','collar','corsage','corset',
                    'costume','crocs','crop top','culotte','dress','dress on pants','diamond','dressing gown','dungarees','earring','fan',
                    'feather','flared jeans',
                    'gilet','glasses','glove','gown','handbag','handkerchief','hat','headband','heels','hoodie','jacket','jeans','jeggings','jogging','jumper',
                    'jumpsuit','jupe','kerchief','kilt','kimono','knots','laysuit','legging','lingerie','loafers','mao collar','mariniere','necklace','necktie',
                    'nightgown','nightwear','overalls','oxford','pajama','panties','pants','parka',
                    'pantyhose','patch','patchwork','pencil skirt','pearl','perfecto','peter pan collar','platform boots','playsuit','pocket','polo',
                    'pompom','poncho','puffer','pullover','pyjama','raincoat','reefer','ribbon','ring','satchel','sandal','scarf','shoes','shirt',
                    'shirt dress','shorts','skirt','skirt dress','sleeve','sleeveless',
                    'slip','slipper','slip dress','smoking','socks','stilletos','suit','sunglasses','sweater','sweatpants',
                    'sweatshirt','swimsuit','tank top','teeshirt','tennis','tie','tights','top','trainers','trench','trenchcoat','trousers','tunic',
                    'turtleneck','tuxedo','underwear','veil','vest','waistcoat','watch','zip'] as JSON
        render list
    }

    def itemTypes(){
        
        def itemTypes = SearchableItemType.list() as JSON
        render itemTypes
    }

    def colors(){
        def colors = ['baby blue','blue light','beige','bicolour','black','bleu','blue','bordeaux',
                'bright','bronze','brown','brown light','burgundy','camel','cobalt','cognac','colorful',
                'coral','cream','duotone','fuschia','glitter','gold','gray','green','grey','ivory','jaune',
                'khaki','lavendar','lilac','lime','metallic','monochrome',
                'multicolour','mustard','navy blue','noir','nude','orange','pastel','pearl',
                'pink','powder','purple','red','rust','salmon','shine','silver','transparent',
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

/*nolwenn's list */
/*type, type_1, colors, and fabrics have been integrated in the above */
/*TYPE:

‘BOMBER’,’BIKINI’,’BLAZER’,’BLOUSE’,’BODY’,’TUNIC',’BRA',’BUSTIER',’CAPE',’CARDIGAN',’COAT’,’CORSAGE',‘CORSET',’PANTIES',’CULOTTE',’DRESS',’DRESSING GOWN’,’DUNGAREES',’GILET',’GOWN',’HOODIE',’JACKET',’JEAN',’JOGGING',’JUMPER',’JUMPSUIT',’KILT',’KIMONO',’LAYSUIT',’LEGGING',’LINGERIE’,’PLAYSUIT',’PULLOVER',’NIGHTWEAR',’OVERALLS',’PAJAMA’,’PANTS',’PARKA',’PANYHOSE’,’PERFECTO',’POLO',’PONCHO',’RAINCOAT',’SHIRT',’SHIRT DRESS’,’SHORTS’,’SKIRT',’SMOKING',’SUIT',’SWEATER',’SWEATPANTS',’SWEATSHIRT',’TEESHIRT',’TOP’,’TRENCH',’TRENCHCOAT',’TROUSERS',‘TURTLENECK’,’TUXEDO',’WAISTCOAT',’CROP TOP',’BODYCON',’SWIMSUIT',’DRESS ON PANTS’,’TANK TOP’,’BERMUDA',’PLAYSUIT',’UNDERWEAR',’MARINIÈRE'

TYPE_1 (ACCESSORIES):

‘BAG’,’BELT’,’BRACELET',’BUTTON',’CAP',’COLLAR',’DIAMOND',’EARRING',’TRAINERS',’FAN',’FEATHER',’GLASSES',’GLOVE',’HANDBAG',’HEELS',’KNOTS',’NECKLACE';’NECKTIE’,’NODE',’PATCH',’PATCHWORK',’PEARL',’PETER PAN COLLAR',’PLATFORM SHOES',’POCKET',’POMPOM',’RING’,’SCARF',’SHOES',’BRACES',’SLIPPER',’SMALL BAG',’SOCKS',’SPADE',’STONES',’SUNGLASSES',’TIE',’TIGHTS',’VEIL',’WATCH',’ZIP',’BEADS',’HEADBAND',’BOOTS',’SANDALS',’HAT',’SHOES’,’BABOUCHES',’RIBBON’,’CLAUDINE',’MAO COLLAR',’CROCS',’LOAFERS’

MOTIFS:

‘CAMO’,’CROCHET’,’DOT',’VARNISH',’DRAPE',’EMBROIDERY',’FRINGE',’GEOMETRIC',’GRAFFITI',’HERRINGBONE',’LACEUP’,’LACE',’LEAF',’LEOPARD',’LOGO',’MESH',’PAISLEY',’PINSTRIPE',’POLKA DOT’,’PRINT',’PYTHON',’RUFFLE',’RUSTLE',’SEQUIN',’STITCH',’STRIPE',’TAPESTRY',’TARTAN',’TIGER',’TRIBAL',’VICHY’,’ZEBRA',’ZIGZAG',’SLOGAN',’TRANSPARENT',’GLITTERS',’STRASS',’FLORAL',’ORNAMENT',’EMBELISHMENT',’PATTERN',’PERFORATED',’QUADRILLE',’CROCODILE',‘BEADING’

SHAPE:

‘ASYMETRICAL’,’BALLOON SLEEVES',’FLAT',’HIGH WAIST',’HOTPANTS',’LONG',’MIDI',’MINI',’OFF THE SHOULDER',’OVERSIZE',’PLUNGING NECKLINE',’SHORT',’SHOULDER PADS',’SLEEVELESS’,’SLIM',’SLIT',’SUPERPOSITION',’THICK','V NECK’,’VAPOROUS',’VOLUME',’WAVE','WIDE LEG’,’FLOPPY',’STILETTO','CUT OUT’,'BOLD SHOULDERS’,'MONO SLEEVE’,’LARGE',‘ELASTIC'

COLORS:

’BEIGE’,’BICOLOUR',’BLACK',’BLUE',’BRONZE',’BROWN',’BURGUNDY',’CAMEL',’COGNAC',’COLORFUL',’CORAL',’CREAM',’FUCHSIA',’GLITTER’,’GOLD’,’GRAY',’GREEN,’GREY',’KHAKI',’LAVENDER','LIGHT BLUE’,’LIGHT BROWN’,’LILAC',’METALLIC',’MONOCHROM',’MULTICOLOUR',’MUSTARD',’NAVY BLUE’,’NUDE',’ORANGE',’PASTEL’,’PINK',’POWDER',’PURPLE',’RED',’SHINE',’SILVER',’TURQUOISE',’WHITE',’YELLOW',’SALMON',’IVORY',’FLASH',’PETROL',‘PRUNE'

FABRIC:

‘CASHMERE’,’CORDUROY',’CREPE',’DENIM',’FRILL',’FUR',’KNIT',’LACE',’LAMÉ',’LEATHER',’LINEN',’METAL',’MOHAIR',’ORGANZA',’OXFORD',’PAISLEY',’PLAID’,’PLASTIC',’PVC',’QUILT',’RIB',’SHEARLING',’SHEEP',’SILK',’SUEDE',’SNAKESKIN',’STITCH',’TARTAN',’TULLE',’TWEED',’VELVET',’WATERPROOF',’WOOL',’WRAP',’SATIN',’FISHNET',’SHEER',’CHAMBRAY','NYLON'

BROWSE DATA FOR ’THEME':

‘ANIMAL’,’ARMY',’ART',’ATHLETIC',’AVIATOR',’BABYDOLL',’BALLERINA',’BAROQUE',’BIKER',’BOHEMIAN',’CAMOUFLAGE',’CHECK',’CIRCUS',’COWBOY',’DANCE',’DESTROY',’DETECTIVE',’DISCO',’DOLL',’DOMINATRIX',’ETHNIC',’FAIRY',’FLAMENCO',’FOLK',’FOLKLORIC',’FUNK',’FUTURISTIC',’GIRLY',’GRAPHIC',’GRUNGE',’HIPPY',’JUNGLE',’MASCULINE',’MERMAID',’MILITARY',’MINIMAL',’OFFICER',’ORIENTAL',’POP',’PRINCESS',’PSYCHEDELIC',’PUNK',’REBEL',’RETRO',’ROCK',’ROMANTIC',’ROYAL',’RURAL',’SAFARI',’SAILOR',’SPORT',’STAR','STUDIO 54’,’TEENAGER',’URBAN',’UTILITY',’VICTORIAN',’VINTAGE',’VINYL',’WARRIOR',‘WESTERN'
*/