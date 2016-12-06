import pashion.*
import java.text.SimpleDateFormat
import java.util.Date
import grails.converters.JSON
import grails.util.Environment




class BootStrap {
    def sessionFactory
    def grailsApplication
    def init = { servletContext ->
  
      def ctx = grailsApplication.mainContext
      def userService = ctx.userService

      JSON.registerObjectMarshaller(SearchableItem) {
        def returnArray = [:]
        returnArray['image'] = it.image
        returnArray['id'] =  it.id
        returnArray['name'] =  it.name
        returnArray['season'] = it.season.name
        returnArray['brand'] = it.brand.name
        return returnArray
      }
// RM don't remove this section, used by comms
      JSON.registerObjectMarshaller(User) {
        def returnArray = [:]
        returnArray['name'] = it.name
        returnArray['id'] =  it.id
        returnArray['email'] = it.email
        returnArray['surname'] = it.surname
        returnArray['brand'] = it.brand
        returnArray['pressHouse'] = it.pressHouse
        return returnArray
      }

      def dateFormatString = "yyyy-MM-dd"
      SimpleDateFormat dateFormat =  new SimpleDateFormat(dateFormatString)
      def itemtype1 = SearchableItemType.findOrSaveWhere(display:'Looks',searchCode:'look').save(failOnError : true)
      def itemtype2 = SearchableItemType.findOrSaveWhere(display:'Samples',searchCode:'sample').save(failOnError : true)
      def itemtype3 = SearchableItemType.findOrSaveWhere(display:'Runway',searchCode:'runway').save(failOnError : true)

      def s2 =  Season.findOrSaveWhere(name:'Spring 2016 Couture').save(failOnError : true)
      def s1 =  Season.findOrSaveWhere(name:'Fall 2016 Couture').save(failOnError : true)
      def s9 =  Season.findOrSaveWhere(name:'Fall 2016 Menswear').save(failOnError : true)
      def s3 =  Season.findOrSaveWhere(name:'Fall 2016 Ready-to-Wear').save(failOnError : true)
      
      def s4 =  Season.findOrSaveWhere(name:'Resort 2017').save(failOnError : true)
      def s5 =  Season.findOrSaveWhere(name:'Spring 2017 Couture').save(failOnError : true)
      def s10 = Season.findOrSaveWhere(name:'Spring 2017 Ready-to-Wear').save(failOnError : true)
      def s7 =  Season.findOrSaveWhere(name:'Spring 2017 Menswear').save(failOnError : true)
      def s8 =  Season.findOrSaveWhere(name:'Winter 2017 Menswear').save(failOnError : true)

      if ("Old" == "Test Data") {
    
        if (Brand.count() == 0) {
          log.info "Creating Base Test Data"
          
          
          Date availableFrom = dateFormat.parse("2016-12-01")
          Date availableTo = dateFormat.parse("2016-12-15")
          def address1 = new Address(name:'RL London East',defaultAddress:true).save()
          def address2 = new Address(name:'RL London West',defaultAddress:false).save()
          def brand1 = new Brand(name:'Ralph Lauren', city:'London', stormpathDirectory:"https://api.stormpath.com/v1/directories/Z14nWfywLDah6jS8NByk2" )
          brand1.addToAddresses(address1)
          brand1.addToAddresses(address2)
          brand1.save(failOnError : true)

          def collection1 = new BrandCollection(season: s3, brand:brand1).save(failOnError : true)
          def collection2 = new BrandCollection(season: s5, brand:brand1).save(failOnError : true)
        	def collection3 = new BrandCollection(season: s8, brand:brand1).save(failOnError : true)

          def look1 = new SearchableItem(type:itemtype1,brand:brand1,season: s3, color:"white",fromDate:availableFrom, toDate:availableTo, name: 'black dress', image: '/assets/looks/1.jpg', brandCollection:collection1).save(failOnError : true)
          def sample1 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "dress", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
          def sample2 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "hat", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
          def sample3 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "shoes", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
          def sample4 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "bracelet", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
          def sample5 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "belt", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)

          look1 = new SearchableItem(type:itemtype1,brand:brand1,season: s3, color:"white",fromDate:availableFrom, toDate:availableTo, name: 'silk dress', image: '/assets/looks/2.jpg', brandCollection:collection1).save(failOnError : true)
          sample1 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "dress", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
          sample2 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "hat", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
          sample3 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "shoes", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
          sample4 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "bracelet", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
          sample5 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "belt", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)

          look1 = new SearchableItem(type:itemtype1,brand:brand1,season: s3, color:"white",fromDate:availableFrom, toDate:availableTo, name: 'skirt', image: '/assets/looks/3.jpg', brandCollection:collection1).save(failOnError : true)
          sample1 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "dress", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
          sample2 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "hat", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
          sample3 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "shoes", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
          sample4 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "bracelet", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
          sample5 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "belt", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)

          look1 = new SearchableItem(type:itemtype1,brand:brand1,season: s3, color:"white",fromDate:availableFrom, toDate:availableTo, name: 'red', image: '/assets/looks/4.jpg', brandCollection:collection1).save(failOnError : true)
          sample1 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "dress", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
          sample2 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "hat", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
          sample3 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "shoes", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
          sample4 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "bracelet", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
          sample5 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "belt", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)

          look1 =  new SearchableItem(type:itemtype1,brand:brand1,season: s3, color:"white",fromDate:availableFrom, toDate:availableTo, name: 'A look 5', image: '/assets/looks/5.jpg', brandCollection:collection1).save(failOnError : true)
          sample1 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "dress", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
          sample2 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "hat", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
          sample3 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "shoes", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
          sample4 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "bracelet", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
          sample5 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "belt", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)

          look1 =  new SearchableItem(type:itemtype1,brand:brand1,season: s3, color:"white",fromDate:availableFrom, toDate:availableTo, name: 'A look 6', image: '/assets/looks/6.jpg', brandCollection:collection1).save(failOnError : true)
          sample1 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "dress", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
          sample2 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "hat", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
          sample3 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "shoes", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
          sample4 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "bracelet", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
          sample5 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "belt", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)

          look1 =  new SearchableItem(type:itemtype1,brand:brand1,season: s3, color:"white",fromDate:availableFrom, toDate:availableTo, name: 'A look 7', image: '/assets/looks/7.jpg', brandCollection:collection1).save(failOnError : true)
          sample1 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "dress", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
          sample2 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "hat", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
          sample3 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "shoes", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
          sample4 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "bracelet", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
          sample5 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "belt", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)

          look1 = new SearchableItem(type:itemtype1,brand:brand1,season: s3, color:"white",fromDate:availableFrom, toDate:availableTo, name: 'A look 8', image: '/assets/looks/8.jpg', brandCollection:collection1).save(failOnError : true)
          sample1 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "dress", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
          sample2 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "hat", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
          sample3 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "shoes", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
          sample4 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "bracelet", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
          sample5 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "belt", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)

          look1 =  new SearchableItem(type:itemtype1,brand:brand1,season: s3, color:"white",fromDate:availableFrom, toDate:availableTo, name: 'A look 9', image: '/assets/looks/9.jpg', brandCollection:collection1).save(failOnError : true)
          sample1 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "dress", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
          sample2 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "hat", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
          sample3 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "shoes", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
          sample4 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "bracelet", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
          sample5 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "belt", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)


          look1 = new SearchableItem(type:itemtype1,brand:brand1,season: s5,color:"black",fromDate:availableFrom, toDate:availableTo, name: 'blue dress', image: '/assets/looks/1.jpg', brandCollection:collection2).save(failOnError : true)
          sample1 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "dress", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
          sample2 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "hat", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
          sample3 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "shoes", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
          sample4 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "bracelet", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
          sample5 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "belt", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
          look1 =  new SearchableItem(type:itemtype1,brand:brand1,season: s5,color:"black",fromDate:availableFrom, toDate:availableTo, name: 'rock star', image: '/assets/looks/2.jpg', brandCollection:collection2).save(failOnError : true)
          sample1 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "dress", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
          sample2 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "hat", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
          sample3 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "shoes", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
          sample4 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "bracelet", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
          sample5 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "belt", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
          look1 =  new SearchableItem(type:itemtype1,brand:brand1,season: s5,color:"black",fromDate:availableFrom, toDate:availableTo, name: 'A look 3', image: '/assets/looks/3.jpg', brandCollection:collection2).save(failOnError : true)
          sample1 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "dress", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
          sample2 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "hat", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
          sample3 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "shoes", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
          sample4 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "bracelet", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
          sample5 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "belt", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
          look1 =  new SearchableItem(type:itemtype1,brand:brand1,season: s5,color:"black",fromDate:availableFrom, toDate:availableTo, name: 'A look 4', image: '/assets/looks/4.jpg', brandCollection:collection2).save(failOnError : true)
          sample1 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "dress", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
          sample2 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "hat", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
          sample3 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "shoes", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
          sample4 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "bracelet", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
          sample5 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "belt", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
          look1 =  new SearchableItem(type:itemtype1,brand:brand1,season: s5,color:"black",fromDate:availableFrom, toDate:availableTo, name: 'A look 5', image: '/assets/looks/5.jpg', brandCollection:collection2).save(failOnError : true)
          sample1 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "dress", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
          sample2 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "hat", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
          sample3 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "shoes", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
          sample4 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "bracelet", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
          sample5 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "belt", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
          look1 =  new SearchableItem(type:itemtype1,brand:brand1,season: s5,color:"black",fromDate:availableFrom, toDate:availableTo, name: 'A look 6', image: '/assets/looks/6.jpg', brandCollection:collection2).save(failOnError : true)
          sample1 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "dress", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
          sample2 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "hat", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
          sample3 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "shoes", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
          sample4 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "bracelet", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
          sample5 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "belt", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
          look1 =  new SearchableItem(type:itemtype1,brand:brand1,season: s5,color:"black",fromDate:availableFrom, toDate:availableTo, name: 'A look 7', image: '/assets/looks/7.jpg', brandCollection:collection2).save(failOnError : true)
          sample1 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "dress", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
          sample2 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "hat", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
          sample3 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "shoes", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
          sample4 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "bracelet", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
          sample5 = new SearchableItem(look:look1,season:s3, type:itemtype2,brand:brand1,name: "belt", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)


          
          brand1 = new Brand(name:'Paco Rabanne', city:'Paris', stormpathDirectory:"https://api.stormpath.com/v1/directories/5kWuLmjcZnIr3fezLeYRH9" ).save(failOnError : true)
          
            
          collection1 = new BrandCollection(season: s5, brand:brand1).save(failOnError : true)
            
          availableFrom = dateFormat.parse("2017-01-01")
          availableTo = dateFormat.parse("2017-01-15")
          def bookingFrom = dateFormat.parse("2017-01-10")
          def bookingTo = dateFormat.parse("2017-01-14")
      
            for(i in 1..20){
                  log.info "creating lots of looks"
                  def look101 = new SearchableItem(type:itemtype1,brand:brand1,season: s5,color:"white",fromDate:availableFrom, toDate:availableTo, name: 'white no sleeves pink waist pants', image: '/assets/looks/paco/10.jpg', brandCollection:collection1).save(failOnError : true, flush: true);
                  
                  sample1 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "dress", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample2 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "hat", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample3 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "shoes", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample4 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "bracelet", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample5 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "belt", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  
                  
                  look101 = new SearchableItem(type:itemtype1,brand:brand1,season: s5,color:"white",fromDate:availableFrom, toDate:availableTo, name: 'white hoodie dress', image: '/assets/looks/paco/11.jpg', brandCollection:collection1).save(failOnError : true, flush: true);
                  sample1 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "dress", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample2 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "hat", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample3 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "shoes", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample4 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "bracelet", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample5 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "belt", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  

                  look101 = new SearchableItem(type:itemtype1,brand:brand1,season: s5,color:"white",fromDate:availableFrom, toDate:availableTo, name: 'white hoodie short jacket shorts', image: '/assets/looks/paco/12.jpg', brandCollection:collection1).save(failOnError : true, flush: true);
                  sample1 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "dress", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample2 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "hat", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample3 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "shoes", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample4 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "bracelet", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample5 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "belt", color:"red", material:"silk", size:"0")
                  

                  look101 = new SearchableItem(type:itemtype1,brand:brand1,season: s5,color:"white",fromDate:availableFrom, toDate:availableTo, name: 'white cut blouse medium skirt', image: '/assets/looks/paco/13.jpg', brandCollection:collection1).save(failOnError : true, flush: true);
                  sample1 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "dress", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample2 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "hat", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample3 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "shoes", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample4 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "bracelet", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample5 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "belt", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  

                  look101 = new SearchableItem(type:itemtype1,brand:brand1,season: s5,color:"white",fromDate:availableFrom, toDate:availableTo, name: 'white hoodie baggy pants', image: '/assets/looks/paco/14.jpg', brandCollection:collection1).save(failOnError : true, flush: true);
                  sample1 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "dress", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample2 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "hat", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample3 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "shoes", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample4 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "bracelet", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample5 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "belt", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  

                  look101 = new SearchableItem(type:itemtype1,brand:brand1,season: s5,color:"blue",fromDate:availableFrom, toDate:availableTo, name: 'aqua stripe top blue knee skirt', image: '/assets/looks/paco/15.jpg', brandCollection:collection1).save(failOnError : true, flush: true);
                  sample1 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "dress", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample2 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "hat", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample3 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "shoes", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample4 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "bracelet", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample5 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "belt", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  

                  look101 = new SearchableItem(type:itemtype1,brand:brand1,season: s5,color:"blue",fromDate:availableFrom, toDate:availableTo, name: 'blue baggie dress black hood', image: '/assets/looks/paco/16.jpg', brandCollection:collection1).save(failOnError : true, flush: true);
                  sample1 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "dress", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample2 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "hat", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample3 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "shoes", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample4 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "bracelet", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample5 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "belt", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  

                  look101 = new SearchableItem(type:itemtype1,brand:brand1,season: s5,color:"white",fromDate:availableFrom, toDate:availableTo, name: 'white sleeveless blouse white pants', image: '/assets/looks/paco/17.jpg', brandCollection:collection1).save(failOnError : true, flush: true);
                  sample1 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "dress", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample2 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "hat", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample3 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "shoes", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample4 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "bracelet", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample5 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "belt", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  

                  look101 = new SearchableItem(type:itemtype1,brand:brand1,season: s5,color:"white",fromDate:availableFrom, toDate:availableTo, name: 'white sleeveless cutout blouse white flared pants', image: '/assets/looks/paco/18.jpg', brandCollection:collection1).save(failOnError : true, flush: true);
                  sample1 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "dress", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample2 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "hat", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample3 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "shoes", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample4 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "bracelet", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample5 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "belt", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  

                  look101 = new SearchableItem(type:itemtype1,brand:brand1,season: s5,color:"white",fromDate:availableFrom, toDate:availableTo, name: 'white sleeveless flared blouse white flared pants', image: '/assets/looks/paco/19.jpg', brandCollection:collection1).save(failOnError : true, flush: true);
                  sample1 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "dress", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample2 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "hat", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample3 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "shoes", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample4 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "bracelet", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample5 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "belt", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  

                  look101 = new SearchableItem(type:itemtype1,brand:brand1,season: s5,color:"black",fromDate:availableFrom, toDate:availableTo, name: 'black and grey stripes long sleeve blouse back and grey knee length skirt', image: '/assets/looks/paco/20.jpg', brandCollection:collection1).save(failOnError : true, flush: true);
                  sample1 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "dress", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample2 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "hat", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample3 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "shoes", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample4 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "bracelet", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample5 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "belt", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                 
                  
                  look101 = new SearchableItem(type:itemtype1,brand:brand1,season: s5,color:"white",fromDate:availableFrom, toDate:availableTo, name: 'white and silver sleeveless blouse long silver skirt', image: '/assets/looks/paco/21.jpg', brandCollection:collection1).save(failOnError : true, flush: true);
                  sample1 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "dress", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample2 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "hat", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample3 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "shoes", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample4 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "bracelet", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample5 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "belt", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  
                  
                  look101 = new SearchableItem(type:itemtype1,brand:brand1,season: s5,color:"black",fromDate:availableFrom, toDate:availableTo, name: 'black tie across hoodie black shorts', image: '/assets/looks/paco/22.jpg', brandCollection:collection1).save(failOnError : true, flush: true);
                  sample1 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "dress", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample2 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "hat", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample3 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "shoes", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample4 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "bracelet", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample5 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "belt", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  
                  
                  look101 = new SearchableItem(type:itemtype1,brand:brand1,season: s5,color:"black",fromDate:availableFrom, toDate:availableTo, name: 'black jacket pocket square black leather skirt', image: '/assets/looks/paco/23.jpg', brandCollection:collection1).save(failOnError : true, flush: true);
                  sample1 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "dress", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample2 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "hat", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample3 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "shoes", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample4 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "bracelet", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample5 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "belt", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  

                  look101 = new SearchableItem(type:itemtype1,brand:brand1,season: s5,color:"white",fromDate:availableFrom, toDate:availableTo, name: 'white with black lines blouse and long dress', image: '/assets/looks/paco/24.jpg', brandCollection:collection1).save(failOnError : true, flush: true);
                  sample1 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "dress", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample2 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "hat", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample3 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "shoes", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample4 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "bracelet", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample5 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "belt", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  
                  
                  look101 = new SearchableItem(type:itemtype1,brand:brand1,season: s5,color:"white",fromDate:availableFrom, toDate:availableTo, name: 'white blouse 60s hip hugger pants', image: '/assets/looks/paco/25.jpg', brandCollection:collection1).save(failOnError : true, flush: true);
                  sample1 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "dress", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample2 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "hat", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample3 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "shoes", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample4 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "bracelet", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample5 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "belt", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  

                  look101 = new SearchableItem(type:itemtype1,brand:brand1,season: s5,color:"white",fromDate:availableFrom, toDate:availableTo, name: 'blue lace see through white dress', image: '/assets/looks/paco/26.jpg', brandCollection:collection1).save(failOnError : true, flush: true);
                  sample1 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "dress", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample2 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "hat", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample3 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "shoes", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample4 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "bracelet", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample5 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "belt", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                                    
                  look101 = new SearchableItem(type:itemtype1,brand:brand1,season: s5,color:"white",fromDate:availableFrom, toDate:availableTo, name: 'white lace white shorts', image: '/assets/looks/paco/27.jpg', brandCollection:collection1).save(failOnError : true, flush: true);
                  sample1 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "dress", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample2 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "hat", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample3 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "shoes", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample4 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "bracelet", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample5 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "belt", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  

                  look101 = new SearchableItem(type:itemtype1,brand:brand1,season: s5,color:"black",fromDate:availableFrom, toDate:availableTo, name: 'black short dress with black shorts', image: '/assets/looks/paco/28.jpg', brandCollection:collection1).save(failOnError : true, flush: true);
                  sample1 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "dress", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample2 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "hat", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample3 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "shoes", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample4 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "bracelet", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample5 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "belt", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                 

                  look101 = new SearchableItem(type:itemtype1,brand:brand1,season: s5,color:"white",fromDate:availableFrom, toDate:availableTo, name: 'white long sleeve white knee length skirt', image: '/assets/looks/paco/29.jpg', brandCollection:collection1).save(failOnError : true, flush: true);
                  sample1 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "dress", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample2 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "hat", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample3 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "shoes", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample4 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "bracelet", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample5 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "belt", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  

                  look101 = new SearchableItem(type:itemtype1,brand:brand1,season: s5,color:"white",fromDate:availableFrom, toDate:availableTo, name: 'high neck dress with white shorts', image: '/assets/looks/paco/30.jpg', brandCollection:collection1).save(failOnError : true, flush: true);
                  sample1 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "dress", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample2 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "hat", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample3 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "shoes", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample4 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "bracelet", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample5 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "belt", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  

                  look101 = new SearchableItem(type:itemtype1,brand:brand1,season: s5,color:"white",fromDate:availableFrom, toDate:availableTo, name: 'silk dress', image: '/assets/looks/paco/31.jpg', brandCollection:collection1).save(failOnError : true, flush: true);
                  sample1 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "dress", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample2 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "hat", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample3 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "shoes", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample4 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "bracelet", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample5 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "belt", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  

                  look101 = new SearchableItem(type:itemtype1,brand:brand1,season: s5,color:"white",fromDate:availableFrom, toDate:availableTo, name: 'lacy dress with pink', image: '/assets/looks/paco/32.jpg', brandCollection:collection1).save(failOnError : true, flush: true);
                  sample1 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "dress", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample2 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "hat", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample3 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "shoes", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample4 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "bracelet", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  sample5 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "belt", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  
                  
                  sessionFactory.getCurrentSession().clear()
            }

        }

        if(Brand.findByName("Chanel") == null){
          def brand1 = new Brand(name:'Chanel', city:'Paris' ).save(failOnError : true)
          def sea =  Season.findByName('Spring 2017 Ready-to-Wear')
          def collection1 = new BrandCollection(season: sea, brand:brand1).save(failOnError : true)
           itemtype1 =  SearchableItemType.findBySearchCode('look')
          def available = dateFormat.parse("2017-01-15")
          def range = 1..369
          range.each{
            String imageNumber = it.toString().padLeft(4,'0')
            String imageLocation = "//dvch4zq3tq7l4.cloudfront.net/chanel/2017/spring/ready-to-wear/"+imageNumber+".jpg"
            def look1 = new SearchableItem(type:itemtype1,brand:brand1,season: sea,availableFrom:available, image: imageLocation,brandCollection:collection1).save(flush:true,failOnError : true)
            log.info "created look:"+look1
          }

        }

        if(Brand.findByName("Miu Miu") == null){
          def brand1 = new Brand(name:'Miu Miu', city:'Paris' ).save(failOnError : true)
          def sea =  Season.findByName('Spring 2017 Ready-to-Wear')
          def collection1 = new BrandCollection(season: sea, brand:brand1).save(failOnError : true)
           itemtype1 =  SearchableItemType.findBySearchCode('look')
          def range = 1..277
          range.each{
            String imageNumber = it.toString().padLeft(4,'0')
            String imageLocation = "//dvch4zq3tq7l4.cloudfront.net/miu-miu/2017/spring/ready-to-wear/"+imageNumber+".jpg"
            def look1 = new SearchableItem(type:itemtype1,brand:brand1,season: sea, image: imageLocation,brandCollection:collection1).save(flush:true,failOnError : true)
            log.info "created look:"+look1
          }

        }

        if(Brand.findByName("Alberta Ferretti") == null){
          def brand1 = new Brand(name:'Alberta Ferretti', city:'Milan' ).save(failOnError : true)
          def sea =  Season.findByName('Fall 2016 Ready-to-Wear')
          def collection1 = new BrandCollection(season: sea, brand:brand1).save(failOnError : true)
           itemtype1 =  SearchableItemType.findBySearchCode('look')
          def range = 1..281
          range.each{
            String imageNumber = it.toString().padLeft(4,'0')
            String imageLocation = "//dvch4zq3tq7l4.cloudfront.net/alberta-ferretti/2016/fall/ready-to-wear/"+imageNumber+".jpg"
            def look1 = new SearchableItem(type:itemtype1,brand:brand1,season: sea, image: imageLocation,brandCollection:collection1).save(flush:true,failOnError : true)
            log.info "created look:"+look1
          }

        }

        if(Brand.findByName("Ralph Lauren").brandCollections.size() < 4){
          
          def brand1 =  Brand.findByName('Ralph Lauren')
          def sea =  Season.findByName('Spring 2017 Ready-to-Wear')
          def collection1 = new BrandCollection(season: sea, brand:brand1).save(failOnError : true)
           itemtype1 =  SearchableItemType.findBySearchCode('look')
          def available = dateFormat.parse("2017-01-15")
          def range = 1..206
          range.each{
            String imageNumber = it.toString().padLeft(4,'0')
            String imageLocation = "//dvch4zq3tq7l4.cloudfront.net/ralph-lauren/2017/spring/ready-to-wear/"+imageNumber+".jpg"
            def look1 = new SearchableItem(type:itemtype1,availableFrom:available,brand:brand1,season: sea, image: imageLocation,brandCollection:collection1).save(flush:true,failOnError : true)
            log.info "created look:"+look1
          }

        }

        if(Brand.findByName("Christopher Kane") ==  null){
          
          def brand1 = new Brand(name:'Christopher Kane', city:'London' ).save(failOnError : true)
          def sea =  Season.findByName('Spring 2017 Ready-to-Wear')
          def collection1 = new BrandCollection(season: sea, brand:brand1).save(failOnError : true)
           itemtype1 =  SearchableItemType.findBySearchCode('look')
          def available = dateFormat.parse("2017-01-15")
          def range = 1..38
          range.each{
            String imageNumber = it.toString().padLeft(4,'0')
            String imageLocation = "//dvch4zq3tq7l4.cloudfront.net/christopher-kane/2017/spring/ready-to-wear/"+imageNumber+".jpg"
            def look1 = new SearchableItem(type:itemtype1,availableFrom:available,brand:brand1,season: sea, image: imageLocation,brandCollection:collection1).save(flush:true,failOnError : true)
            log.info "created look:"+look1
          }

        }

        if (User.findByEmail("ellen@pashiontool.com") == null){

          def press = new PressHouse(name:"Elle Magazine",stormpathDirectory:"https://api.stormpath.com/v1/directories/jVKqqTZOmOFXPWO53PgoY")
          def address1 = new Address(name:'Elle London North',defaultAddress:true).save()
          def address2 = new Address(name:'Elle London South',defaultAddress:false).save()
          press.addToAddresses(address1)
          press.addToAddresses(address2)
          press.save(flush:true,failOnError : true)
          def ellen = new User(name:"Ellen",surname:"Mcinsky", email:"ellen@pashiontool.com",pressHouse:press).save(flush:true,failOnError : true)
          

          def brand = Brand.findByName("Ralph Lauren")
          def lauren = new User(name:"Lauren",surname:"Van Doren",email:"lauren@pashiontool.com",brand:brand).save(flush:true,failOnError : true)
        }

        if(User.findByEmail("paco@pashiontool.com") == null){
          def brand = Brand.findByName('Paco Rabanne')
          def lauren = new User(name:"Paco",surname:"Notorious",email:"paco@pashiontool.com",brand:brand).save(flush:true,failOnError : true)
        }
      }

      if (Environment.current == Environment.PRODUCTION) {

        if(Brand.findByName("Christopher Kane") ==  null){
          
          def brand1 = new Brand(name:'Christopher Kane', city:'London' ).save(failOnError : true)
          def sea =  Season.findOrSaveByName('Spring 2017 Ready-to-Wear')
          def collection1 = new BrandCollection(season: sea, brand:brand1).save(failOnError : true)
        }

      }

    }
    def destroy = {
    }
}
