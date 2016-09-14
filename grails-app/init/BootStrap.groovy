import pashion.*


class BootStrap {

    def init = { servletContext ->
        if (Brand.count() == 0) {

            def brand1 = new Brand(name:'Ralph Lauren', city:'London' ).save(failOnError : true)
            def collection1 = new Collection(season: 'Fall 2016 Ready-to-Wear', brand:brand1).save(failOnError : true)
            def collection2 = new Collection(season: 'Spring 2017 Couture', brand:brand1).save(failOnError : true)
        	def collection3 = new Collection(season: 'Winter 2017 Menswear', brand:brand1).save(failOnError : true)
            def look1 = new Look(name: 'A look', image: '/assets/looks/1.jpg', collection:collection1).save()
            def look2 = new Look(name: 'A look 2', image: '/assets/looks/2.jpg', collection:collection1).save()
            def look3 = new Look(name: 'A look 3', image: '/assets/looks/3.jpg', collection:collection1).save()
            def look4 = new Look(name: 'A look 4', image: '/assets/looks/4.jpg', collection:collection1).save()
            def look5 = new Look(name: 'A look 5', image: '/assets/looks/5.jpg', collection:collection1).save()
            def look6 = new Look(name: 'A look 6', image: '/assets/looks/6.jpg', collection:collection1).save()
            def look7 = new Look(name: 'A look 7', image: '/assets/looks/7.jpg', collection:collection1).save()
            def look8 = new Look(name: 'A look 8', image: '/assets/looks/8.jpg', collection:collection1).save()
            def look9 = new Look(name: 'A look 9', image: '/assets/looks/9.jpg', collection:collection1).save()


             look1 = new Look(name: 'A look', image: '/assets/looks/1.jpg', collection:collection2).save()
             look2 = new Look(name: 'A look 2', image: '/assets/looks/2.jpg', collection:collection2).save()
             look3 = new Look(name: 'A look 3', image: '/assets/looks/3.jpg', collection:collection2).save()
             look4 = new Look(name: 'A look 4', image: '/assets/looks/4.jpg', collection:collection2).save()
             look5 = new Look(name: 'A look 5', image: '/assets/looks/5.jpg', collection:collection2).save()
             look6 = new Look(name: 'A look 6', image: '/assets/looks/6.jpg', collection:collection2).save()
             look7 = new Look(name: 'A look 7', image: '/assets/looks/7.jpg', collection:collection2).save()
             
             def sample1 = new Sample(name: "dress", color:"red", type:"silk", size:"0",
                                         look:look1,location:"RL London").save(failOnError: true)
             def sample2 = new Sample(name: "dress", color:"blue", type:"cotton", size:"2",
                                         look:look2, location:"RL London").save(failOnError: true)
             def today = new Date().clearTime()
             
             def due = today + 20
             
             def samplereq1 = new SampleRequest(brand:brand1,idString:"5555L",samples:[sample2],
                                                status:"Overdue", dateRequested:today,
                                                receivingUserName: "Lauren",
                                                requestingUserName: "Lauren Van Dooren",
                                                editorial: "Punk Shoot",
                                                got: 0,
                                                out: 1,
                                                dateDue:due ).save()

             def samplereq2 = new SampleRequest(brand:brand1,idString:"9696L",
                                                samples:[sample1,sample2],
                                                status:"Overdue", dateRequested:today,
                                                receivingUserName: "Lauren",
                                                requestingUserName: "Jamie Bloom",
                                                editorial: "Summer Fun",
                                                itemsGot: 0,
                                                itemsOut: 2,
                                                dateDue:due ).save()



             def pragency1 = new PRAgency(name:'Karla Otto' ).save()

        }


    }
    def destroy = {
    }
}
