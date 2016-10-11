import pashion.*
import java.text.SimpleDateFormat
import java.util.Date
import grails.converters.JSON



class BootStrap {
    def sessionFactory
    def init = { servletContext ->

      JSON.registerObjectMarshaller(SearchableItem) {
                def returnArray = [:]
                returnArray['image'] = it.image
                returnArray['id'] =  it.id
                
                return returnArray
          }

        if (Brand.count() == 0) {
          log.info "Creating Test Data"
          def itemtype1 = new SearchableItemType(display:'Looks',searchCode:'look').save(failOnError : true)
          def itemtype2 = new SearchableItemType(display:'Samples',searchCode:'sample').save(failOnError : true)
          def itemtype3 = new SearchableItemType(display:'Runway',searchCode:'runway').save(failOnError : true)

          def s2 = new Season(name:'Spring 2016 Couture').save(failOnError : true)
          def s1 = new Season(name:'Fall 2016 Couture').save(failOnError : true)
          def s9 = new Season(name:'Fall 2016 Menswear').save(failOnError : true)
          def s3 = new Season(name:'Fall 2016 Ready-to-Wear').save(failOnError : true)
          
          def s4 = new Season(name:'Resort 2017').save(failOnError : true)
          def s5 = new Season(name:'Spring 2017 Couture').save(failOnError : true)
          def s6 = new Season(name:'Spring 2017 Ready-to-Wear').save(failOnError : true)
          def s7 = new Season(name:'Spring 2017 Menswear').save(failOnError : true)
          def s8 = new Season(name:'Winter 2017 Menswear').save(failOnError : true)
          

          def dateFormatString = "yyyy-MM-dd"
          def dateFormat =  new SimpleDateFormat(dateFormatString)
          Date availableFrom = dateFormat.parse("2016-12-01")
          Date availableTo = dateFormat.parse("2016-12-15")

          def brand1 = new Brand(name:'Ralph Lauren', city:'London' ).save(failOnError : true)

          def collection1 = new BrandCollection(season: s3, brand:brand1).save(failOnError : true)
          def collection2 = new BrandCollection(season: s5, brand:brand1).save(failOnError : true)
        	def collection3 = new BrandCollection(season: s8, brand:brand1).save(failOnError : true)

          def look1 = new SearchableItem(type:itemtype1,brand:brand1,season: s3, color:"white",fromDate:availableFrom, toDate:availableTo, name: 'black dress', image: '/assets/looks/1.jpg', brandCollection:collection1).save(failOnError : true)
          
            def look2 = new SearchableItem(type:itemtype1,brand:brand1,season: s3, color:"white",fromDate:availableFrom, toDate:availableTo, name: 'silk dress', image: '/assets/looks/2.jpg', brandCollection:collection1).save(failOnError : true)
            def look3 = new SearchableItem(type:itemtype1,brand:brand1,season: s3, color:"white",fromDate:availableFrom, toDate:availableTo, name: 'skirt', image: '/assets/looks/3.jpg', brandCollection:collection1).save(failOnError : true)
            def look4 = new SearchableItem(type:itemtype1,brand:brand1,season: s3, color:"white",fromDate:availableFrom, toDate:availableTo, name: 'red', image: '/assets/looks/4.jpg', brandCollection:collection1).save(failOnError : true)
            def look5 = new SearchableItem(type:itemtype1,brand:brand1,season: s3, color:"white",fromDate:availableFrom, toDate:availableTo, name: 'A look 5', image: '/assets/looks/5.jpg', brandCollection:collection1).save(failOnError : true)
            def look6 = new SearchableItem(type:itemtype1,brand:brand1,season: s3, color:"white",fromDate:availableFrom, toDate:availableTo, name: 'A look 6', image: '/assets/looks/6.jpg', brandCollection:collection1).save(failOnError : true)
            def look7 = new SearchableItem(type:itemtype1,brand:brand1,season: s3, color:"white",fromDate:availableFrom, toDate:availableTo, name: 'A look 7', image: '/assets/looks/7.jpg', brandCollection:collection1).save(failOnError : true)
            def look8 = new SearchableItem(type:itemtype1,brand:brand1,season: s3, color:"white",fromDate:availableFrom, toDate:availableTo, name: 'A look 8', image: '/assets/looks/8.jpg', brandCollection:collection1).save(failOnError : true)
            def look9 = new SearchableItem(type:itemtype1,brand:brand1,season: s3, color:"white",fromDate:availableFrom, toDate:availableTo, name: 'A look 9', image: '/assets/looks/9.jpg', brandCollection:collection1).save(failOnError : true)


             look1 = new SearchableItem(type:itemtype1,brand:brand1,season: s5,color:"black",fromDate:availableFrom, toDate:availableTo, name: 'blue dress', image: '/assets/looks/1.jpg', brandCollection:collection2).save(failOnError : true)
             look2 = new SearchableItem(type:itemtype1,brand:brand1,season: s5,color:"black",fromDate:availableFrom, toDate:availableTo, name: 'rock star', image: '/assets/looks/2.jpg', brandCollection:collection2).save(failOnError : true)
             look3 = new SearchableItem(type:itemtype1,brand:brand1,season: s5,color:"black",fromDate:availableFrom, toDate:availableTo, name: 'A look 3', image: '/assets/looks/3.jpg', brandCollection:collection2).save(failOnError : true)
             look4 = new SearchableItem(type:itemtype1,brand:brand1,season: s5,color:"black",fromDate:availableFrom, toDate:availableTo, name: 'A look 4', image: '/assets/looks/4.jpg', brandCollection:collection2).save(failOnError : true)
             look5 = new SearchableItem(type:itemtype1,brand:brand1,season: s5,color:"black",fromDate:availableFrom, toDate:availableTo, name: 'A look 5', image: '/assets/looks/5.jpg', brandCollection:collection2).save(failOnError : true)
             look6 = new SearchableItem(type:itemtype1,brand:brand1,season: s5,color:"black",fromDate:availableFrom, toDate:availableTo, name: 'A look 6', image: '/assets/looks/6.jpg', brandCollection:collection2).save(failOnError : true)
             look7 = new SearchableItem(type:itemtype1,brand:brand1,season: s5,color:"black",fromDate:availableFrom, toDate:availableTo, name: 'A look 7', image: '/assets/looks/7.jpg', brandCollection:collection2).save(failOnError : true)

             look1 = new SearchableItem(type:itemtype1,brand:brand1,season: s8,color:"black",fromDate:availableFrom, toDate:availableTo, name: 'big dress', image: '/assets/looks/1.jpg', brandCollection:collection3).save(failOnError : true)
             look2 = new SearchableItem(type:itemtype1,brand:brand1,season: s8,color:"white",fromDate:availableFrom, toDate:availableTo, name: 'rock star', image: '/assets/looks/2.jpg', brandCollection:collection3).save(failOnError : true)
             look3 = new SearchableItem(type:itemtype1,brand:brand1,season: s8,color:"black",fromDate:availableFrom, toDate:availableTo, name: 'red things', image: '/assets/looks/3.jpg', brandCollection:collection3).save(failOnError : true)
             look4 = new SearchableItem(type:itemtype1,brand:brand1,season: s8,color:"black",fromDate:availableFrom, toDate:availableTo, name: 'purple things', image: '/assets/looks/4.jpg', brandCollection:collection3).save(failOnError : true)
             look5 = new SearchableItem(type:itemtype1,brand:brand1,season: s8,color:"black",fromDate:availableFrom, toDate:availableTo, name: 'black things', image: '/assets/looks/5.jpg', brandCollection:collection3).save(failOnError : true)
             look6 = new SearchableItem(type:itemtype1,brand:brand1,season: s8,color:"black",fromDate:availableFrom, toDate:availableTo, name: 'A look 6', image: '/assets/looks/6.jpg', brandCollection:collection3).save(failOnError : true)
             
             
             def today = new Date().clearTime()
             
             def due = today + 20
             
             

            def pragency1 = new PRAgency(name:'Karla Otto' ).save(failOnError : true)

            brand1 = new Brand(name:'Paco Rabanne', city:'Paris' ).save(failOnError : true)
            collection1 = new BrandCollection(season: s5, brand:brand1).save(failOnError : true)
            
            availableFrom = dateFormat.parse("2017-01-01")
            availableTo = dateFormat.parse("2017-01-15")

            

        
            
            for(i in 1..20){
                  log.info "creating lots of looks"
                  def look101 = new SearchableItem(type:itemtype1,brand:brand1,season: s5,color:"white",fromDate:availableFrom, toDate:availableTo, name: 'white no sleeves pink waist pants', image: '/assets/looks/paco/10.jpg', brandCollection:collection1).save(failOnError : true, flush: true);
                  
                  def sample1 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "dress", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  def sample2 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "hat", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  def sample3 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "shoes", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  def sample4 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "bracelet", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)
                  def sample5 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "belt", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)

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
                  sample5 = new SearchableItem(look:look101,season:s5, type:itemtype2,brand:brand1,name: "belt", color:"red", material:"silk", size:"0").save(failOnError : true, flush: true)

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

                  sessionFactory.getCurrentSession().clear();
            }

        }




    }
    def destroy = {
    }
}
