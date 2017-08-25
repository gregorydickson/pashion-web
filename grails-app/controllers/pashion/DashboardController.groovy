package pashion

import grails.converters.JSON
import java.util.concurrent.ThreadLocalRandom
import com.bertramlabs.plugins.SSLRequired

@SSLRequired
class DashboardController {
    static scope = "session"

    def cachingService


    def index() {
    }

    def deliverToBrand(){
        Brand brand = Brand.get(params.id)
        def id = 0
        def returnList = []
        brand.destinations.each{
            def item = extractAddressProperties(it,null)
            item << [id:id,type:'adhoc',name:it.name]
            ++id
            returnList.add(item)
        }
        
        def users = brand.users
        users.each{ 
            def address
            if(it.address){
                address = extractAddressProperties(it.address,it.id)
            } else{
                address = extractAddressProperties(Address.findByBrandAndDefaultAddress(brand,true),it.id)
            }
            if(address){
                address << [id:id,name:it.name +" "+ it.surname,type: 'user'] 
                returnList.add(address)
            }

            ++id
        }
        returnList.sort{it.name}
        def response = returnList as JSON
        
        render response
    }

    def deliverToPRAgency(){
        PRAgency agency = PRAgency.get(params.id)
        def id = 0
        def returnList = []
        agency.destinations.each{
            def item = extractAddressProperties(it,null)
            item << [id:id,type:'adhoc',name:it.name]
            ++id
            returnList.add(item)
        }
        
        def users = agency.users
        users.each{ 
            def address
            if(it.address){
                address = extractAddressProperties(it.address,it.id)
            } else{
                address = extractAddressProperties(Address.findByPrAgencyAndDefaultAddress(agency,true),it.id)
            }
            
            address << [id:id,name:it.name +" "+ it.surname,type: 'user']
            ++id
            returnList.add(address)
        }
        returnList.sort{it.name}
        def response = returnList as JSON
        
        render response
    }

    def extractAddressProperties(Address address,def userId) {
        if(userId && address){
            return [userId:userId,originalId:address.id,address1:address.address1,city:address.city,
                country:address.country,postalCode:address.postalCode,
                company:address.company,comment:address.comment,attention:address.attention,
                contactPhone:address.contactPhone]
        } else if(address){
            return [originalId:address.id,address1:address.address1,city:address.city,
                country:address.country,postalCode:address.postalCode,
                company:address.company,comment:address.comment,attention:address.attention,
                contactPhone:address.contactPhone]
        }else {
            return []
        }
        
    }


    def citiesObjects(){
        def cities = City.list() as JSON
        render cities
    }

    def outReasonObjects(){
        def outReasons = OutReason.list() as JSON
        render outReasons
    }

    def user(){
        def info
        if(session.user == null){
            info = [type:'nosession' ] as JSON
            render info 
            return
        } 
        def user = session.user
        
        def type
        def companyId
        def company = ""
        if(user.brand){
            type = 'brand'
            companyId = user.brand.id
            company = user.brand.name
        } else if (user.pressHouse) {
            type = 'press'
            companyId = user.pressHouse.id
            company = user.pressHouse.name
        } else if (user.prAgency) {
            type = 'prAgency'
            companyId = user.prAgency.id
            company = user.prAgency.name
        } else {
            type = 'guest'
        }
        //creating a map is more simple than a bunch of marshalling code
        def avatar = User.findById(user.id).avatar
        def userInfo = [email:user.email,id:user.id, type:type,companyId:companyId,company:company, name:user.name,surname:user.surname, avatar:avatar] as JSON
        render userInfo
    }

    def sendGetAccessEmail (){
        def info

        def jsonObject = request.JSON
        log.info "Get Access Email " + jsonObject.newUser + " from " + jsonObject.requestingUser

        if (jsonObject.requestingUser == null) {
            info = [type:'norequestor' ] as JSON
            render info 
            return
        }
        if (jsonObject.newUser == null) {
            info = [type:'nonewuser' ] as JSON
            render info 
            return
        }

        if(session.user == null){
            info = [type:'nosession' ] as JSON
            render info 
            return
        }

        notify "grantAccessRequestEmail" , [requestingUser: jsonObject.requestingUser, newUser: jsonObject.newUser]

        info = [type:'success' ] as JSON
        render info 
        return

    }

    


    def times(){
        def list = ['09:00','09:15','09:30','09:45','10:00','10:15','10:30','10:45',
                    '11:00','11:15','11:30','11:45','12:00','12:15',
                    '12:30','12:45','13:00','13:15','13:30','13:45','14:00','14:15',
                    '14:30','14:45', '15:00','15:15','15:30','15:45','16:00',
                    '16:15','16:30','16:45','17:00','17:15','17:30','17:45','18:00',
                    '18:15','18:30','18:45','19:00','19:15','19:30','19:45','20:00',
                    '20:15','20:30','20:45','21:00','21:15','21:30','21:45','22:00'] as JSON
        render list
    }
    def required(){
    	def list = ['9:00','9:30','10:00','10:30','11:00','11:30',
    				'12:00','12:30','13:00','13:30','14:00','14:30',
    				'15:00','15:30','16:00','16:30','17:00'] as JSON
    	render list
    }

    def cities(){
        def list = ['London','Paris','Milan', 'New York', 'Los Angeles'] as JSON
        render list
    }


    def themes(){
        def list = cachingService.themes() 
        render list
    }

    def sampleTypes = null
    def sampleTypes(){
        if(sampleTypes){
            render sampleTypes
        } else{
            def list = ['bag','babouches','bandana','beads','belt','bermuda','bikini','blazer','blouse','bodice','boots','boyfriend jeans','bomber jacket','boots','bra','bracelet',
                    'braces','bustier','button','cap','cape','cardigan','claudine', 'clutch bag','coat','cocktail dress','collar','corsage','corset',
                    'costume','crocs','crop top','culotte','dress','dress on pants','diamond','dressing gown','dungarees','earring','fan',
                    'feather','flared jeans',
                    'gilet','glasses','glove','gown','handbag','handkerchief','hat','headband','heels','hoodie','jacket','jeans','jeggings','jogging','jumper',
                    'jumpsuit','jupe','kerchief','kilt','kimono','knots','laysuit','legging','lingerie','loafers','mao collar','mariniere','necklace','necktie',
                    'nightgown','nightwear','overalls','oxford','pajama','panties','pants','parka',
                    'pantyhose','patch','patchwork','pencil skirt','pearl','perfecto','peter pan collar','platform boots','playsuit','pocket','polo',
                    'pompom','poncho','puffer','pullover','pyjama','raincoat','reefer','ribbon','ring','satchel','sandal','scarf','shawl','shoes','shirt',
                    'shirt dress','shorts','skirt','skirt dress','sleeve','sleeveless',
                    'slip','slipper','slip dress','smoking','socks','stilletos','suit','sunglasses','sweater','sweatpants',
                    'sweatshirt','swimsuit','tank top','teeshirt','tennis','tie','tights','top','trainers','trench','trenchcoat','trousers','tunic',
                    'turtleneck','tuxedo','underwear','veil','vest','waistcoat','watch','zip']
            
            list = list.collect{it.toUpperCase()}
            sampleTypes = list as JSON
            render sampleTypes
        }
    }

    def itemTypes(){
        
        def itemTypes = SearchableItemType.list() as JSON
        render itemTypes
    }
    def colors = null
    def colors(){
        if(colors){
            render colors
        } else { 

            colors = ['baby blue','blue light','beige','bicolour','black','bleu','blue','bordeaux',
                    'bright','bronze','brown','brown light','burgundy','camel','cobalt','cognac','colorful',
                    'coral','cream','duotone','fuschia','glitter','gold','gray','green','grey','ivory','jaune',
                    'khaki','lavendar','lilac','lime','metallic','monochrome',
                    'multicolour','mustard','navy blue','noir','nude','orange','pastel','pearl',
                    'pink','powder','purple','red','rust','salmon','shine','silver','transparent',
                    'turquoise','white','yellow']
            colors = colors.collect{it.toUpperCase()}  
            colors = colors as JSON
            render colors
        }
    }


    def seasonsByBrand(){
        log.info "season by brand:"
        def brand = session.user.brand
        
        def  seasons = BrandCollection.findAllByBrand(brand,[cache:true]).collect{it.season}.unique()

        def response = seasons as JSON

        render response

    }
    def seasons(){

        def seasons = Season.list() as JSON
        
        render seasons
    }

    def categories(){
        log.info "categories all"
        def categories = Category.list() as JSON

        render categories
    }

    def returnBy(){
    	def list = ['Morning','Noon','Afternoon'] as JSON
    	render list
    }
/*
    def courier(){
        def list = ['Bike','Car','Foot',
                        'Scooter', 'My Courier'] as JSON
        render list
    }
*/
    def courier(){
        def list = ['My Courier','Pashion Courier','They Book'] as JSON
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
        def agency = session.user.prAgency
        def users
        if(press){
            users = User.findAllByPressHouse(press)
        } else if (brand) {
            users = User.findAllByBrand(brand)
        } else 
            users = User.findAllByPrAgency(agency)

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