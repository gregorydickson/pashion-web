import pashion.*


class BootStrap {

    def init = { servletContext ->
        if (Brand.count() == 0) {
            def brand1 = new Brand(name:'Ralph Lauren', city:'London' ).save(failOnError : true)
            def collection1 = new Collection(season: 'Fall 2016 Ready-to-Wear', brand:brand1).save(failOnError : true)
            def collection2 = new Collection(season: 'Spring 2017 Couture', brand:brand1).save(failOnError : true)
        	def collection3 = new Collection(season: 'Winter 2017 Menswear', brand:brand1).save(failOnError : true)
            def look1 = new Look(name: 'A look', image: '/assets/images/looks/1.jpg', collection:collection1).save()
            def look2 = new Look(name: 'A look 2', image: '/assets/images/looks/2.jpg', collection:collection1).save()
            def look3 = new Look(name: 'A look 3', image: '/assets/images/looks/3.jpg', collection:collection1).save()
            def look4 = new Look(name: 'A look 4', image: '/assets/images/looks/4.jpg', collection:collection1).save()
            def look5 = new Look(name: 'A look 5', image: '/assets/images/looks/5.jpg', collection:collection1).save()
            def look6 = new Look(name: 'A look 6', image: '/assets/images/looks/6.jpg', collection:collection1).save()
            def look7 = new Look(name: 'A look 7', image: '/assets/images/looks/7.jpg', collection:collection1).save()
            def look8 = new Look(name: 'A look 8', image: '/assets/images/looks/8.jpg', collection:collection1).save()
            def look9 = new Look(name: 'A look 9', image: '/assets/images/looks/9.jpg', collection:collection1).save()

            //def pragency1 = new PRAgency(name:'Karla Otto' ).save()

        }


    }
    def destroy = {
    }
}
