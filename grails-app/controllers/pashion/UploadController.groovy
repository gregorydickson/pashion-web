package pashion

import grails.transaction.Transactional

import java.text.SimpleDateFormat

import static com.xlson.groovycsv.CsvParser.parseCsv


@Transactional(readOnly = false)
class UploadController {

    def index(){

    }

    def newformat(){

    }

    def detail1(){

    }
    def detail2(){

    }

    // FOR SAMPLES VERSION 1
    def uploaddetail1(){
        if (request.method == 'POST') {
            def submittedFile = request.getFile('file')
            if (submittedFile.empty) {
                flash.message = 'File is mandatory.'
                response.sendError(500)
            } else {
                if (!(submittedFile.getContentType() == 'application/csv'
                        || submittedFile.getContentType() == 'text/csv')) {
                    flash.message = 'File must have a CSV extension.'
                    response.sendError(500)
                } else {
                    def data = parseCsv(submittedFile.getInputStream().getText())
                    City city = City.findOrSaveWhere(name:params.city).save(flush:true,failOnError:true)
                    
                    
                        
                        def count = 0
                        for (row in data) {
                            ++count
                            if(count > 2){ 
                                SearchableItem.withTransaction { status ->
                                    
                                    
                                    SearchableItemType type = SearchableItemType.findByDisplay('Samples')
                                    SearchableItem item = new SearchableItem(type:type)
                                    item.sampleCity = city
                                    Brand brand = Brand.findOrSaveWhere(name:row.values[0].toString().trim()).save()
                                    item.brand = brand
                                    Season season = Season.findOrSaveWhere(name:row.values[1].toString().trim()).save()
                                    item.season = season
                                    SearchableItem look = SearchableItem.findByBrandAndSeasonAndName(brand,season,row.values[2].toString())
                                    item.look           = look
                                    item.name           = row.values[3].toString().trim()
                                    item.sampleType     = row.values[4].toString().trim()

                                    String color1       = row.values[5].toString().trim()
                                    String color2       = row.values[6].toString().trim()
                                    String color3       = row.values[7].toString().trim()
                                    item.color          = color1 + "," + color2 + ","+ color3
                                
                                    item.material       = row.values[8].toString().trim()
                                    String type1         = row.values[9].toString().trim()
                                    if(type != "") item.sampleType = type1

                                    item.shape      = row.values[10].toString().trim()
                                    
                                    item.occasion       = row.values[11].toString().trim()
                                    
                                    String style1       = row.values[12].toString().trim()
                                    String style2       = row.values[13].toString().trim()
                                    item.style = style1 + "," + style2
                                    
                                    String motif1       = row.values[14].toString().trim()
                                    String motif2       = row.values[15].toString().trim()
                                    String motif3       = row.values[16].toString().trim()
                                    item.motif = motif1 + "," + motif2 + "," + motif3

                                    String theme1       = row.values[17].toString().trim()
                                    String theme2       = row.values[18].toString().trim()
                                    item.theme = theme1 + "," + theme2 

                                    item.culture        = row.values[19].toString().trim()
                                    item.lookSeason     = row.values[20].toString().trim()
                                    item.decade         = row.values[21].toString().trim()
                                    
                                    StringBuilder sb = new StringBuilder()
                                    for(def i=4;i<21;i++){
                                        sb.append(row.values[i].toString() + " ") 
                                    }
                                    item.attributes = sb.toString()
                                    look.attributes = look.attributes + " " + sb.toString()
                                    look.save(flush:true,failOnError:true)

                                    item.brandCollection = BrandCollection.findOrSaveWhere(brand:brand,season:season).save()
                                    item.save(flush:true,failOnError:true)
                                    log.info "added sample (detail)"+item
                                }
                            }
                        }

                    flash.message = "Data added to the database."
                    redirect([action: "index"])
                }
            }
        }
    }




    //  VERSION 2 FOR SAMPLES - DETAILS Sheets - NOT LOOKS
    def uploaddetail2(){
        if (request.method == 'POST') {
            def submittedFile = request.getFile('file')
            if (submittedFile.empty) {
                flash.message = 'File is mandatory.'
                response.sendError(500)
            } else {
                if (!(submittedFile.getContentType() == 'application/csv'
                        || submittedFile.getContentType() == 'text/csv')) {
                    flash.message = 'File must have a CSV extension.'
                    response.sendError(500)
                } else {
                    def data = parseCsv(submittedFile.getInputStream().getText())
                    City city = City.findOrSaveWhere(name:params.city)
                    
                        def count = 0
                        for (row in data) {
                            ++count
                            if(count > 2){ 
                                SearchableItem.withTransaction { status ->     
                                    //SAMPLES -  DETAILS 
                                    try{
                                        SearchableItemType type = SearchableItemType.findByDisplay('Samples')
                                        SearchableItem item = new SearchableItem(type:type)
                                        item.sampleCity = city
                                        Brand brand = Brand.findOrSaveWhere(name:row.values[0].toString())
                                        item.brand = brand
                                        Season season = Season.findOrSaveWhere(name:row.values[1].toString().trim())
                                        item.season = season
                                        SearchableItem look = SearchableItem.findByBrandAndSeasonAndNameNumber(brand,season,row.values[2].toInteger())
                                        item.look           = look
                                        item.name           = row.values[3].toString().trim()

                                        item.sex            = row.values[4].toString().trim().toUpperCase()

                                        String color1       = row.values[7].toString().trim().toUpperCase()
                                        String color2       = row.values[8].toString().trim().toUpperCase()
                                        String color3       = row.values[9].toString().trim().toUpperCase()
                                        item.color          = color1 + " " + color2 + " "+ color3
                                    
                                        String material1      = row.values[10].toString().trim().toUpperCase()
                                        String material2      = row.values[11].toString().trim().toUpperCase()
                                        item.material = material1 + " " + material2
                                        
                                        String type1         = row.values[12].toString().trim().toUpperCase()
                                        if(type != "") item.sampleType = type1

                                        String shape1        = row.values[13].toString().trim().toUpperCase()
                                        String shape2        = row.values[14].toString().trim().toUpperCase()
                                        item.shape = shape1 + " " + shape2
                                        
                                        item.occasion       = row.values[15].toString().trim().toUpperCase()
                                        
                                        String style1       = row.values[16].toString().trim().toUpperCase()
                                        String style2       = row.values[17].toString().trim().toUpperCase()
                                        String style3       = row.values[18].toString().trim().toUpperCase()
                                        item.style = style1 + " " + style2  + " " + style3
                                        
                                        String motif1       = row.values[19].toString().trim().toUpperCase()
                                        String motif2       = row.values[20].toString().trim().toUpperCase()
                                        String motif3       = row.values[21].toString().trim().toUpperCase()
                                        String motif4       = row.values[22].toString().trim().toUpperCase()
                                        item.motif = motif1 + " " + motif2 + " " + motif3 + " " + motif4

                                        String theme1       = row.values[23].toString().trim().toUpperCase()
                                        String theme2       = row.values[24].toString().trim().toUpperCase()
                                        String theme3       = row.values[25].toString().trim().toUpperCase()
                                        item.theme = theme1 + " " + theme2  + " " + theme3

                                        item.culture        = row.values[26].toString().trim().toUpperCase()
                                        item.lookSeason     = row.values[27].toString().trim().toUpperCase()
                                        item.decade         = row.values[28].toString().trim().toUpperCase()
                                        
                                        StringBuilder sb = new StringBuilder()
                                        for(def i=4;i<28;i++){
                                            sb.append(row.values[i].toString() + " ") 
                                        }
                                        item.attributes = sb.toString()
                                        look.attributes = look.attributes + " " + sb.toString()
                                        look.isBookable = true
                                        look.save(flush:true,failOnError:true)

                                        item.brandCollection = BrandCollection.findOrSaveWhere(brand:brand,season:season).save()
                                        item.save(flush:true,failOnError:true)
                                        log.info "line:"+count
                                        log.info "added sample (detail)"+item.name
                                        log.info "for look:"+look.name
                                    } catch(Exception e){
                                        log.error "exception:"+e.message
                                        log.error e.printStackTrace()
                                    }
                                }
                            }
                        }

                    flash.message = "Data added to the database."
                    redirect([action: "index"])
                }
            }
        }
    }

    def upload() {
        if (request.method == 'POST') {
            log.info "Post to upload"
            log.info "city:"+params.city
            City city = City.findOrSaveWhere(name:params.city).save(flush:true,failOnError:true)
            def submittedFile = request.getFile('file')
            if (submittedFile.empty) {
                flash.message = 'File is mandatory.'
                response.sendError(500)
                log.error "error no file"
            } else {
                if (!(submittedFile.getContentType() == 'application/csv'
                        || submittedFile.getContentType() == 'text/csv')) {
                    flash.message = 'File must have a CSV extension.'
                    response.sendError(500)
                } else {
                    def data = parseCsv(submittedFile.getInputStream().getText())
                    SearchableItemType type = SearchableItemType.findByDisplay('Looks')
                    def count = 0
                    for (row in data) {
                        ++count
                        if(count > 2 ){ 
                            log.info "adding item"
                            SearchableItem item = new SearchableItem(type:type)
                            Brand brand = Brand.findOrSaveWhere(name:row.values[0].toString().trim()).save()
                            item.brand = brand
                            item.city = city
                            Season season = Season.findOrSaveWhere(name:row.values[1].toString().trim()).save()
                            item.season = season
                            item.name           = row.values[2].toString().trim()
                            item.sex            = row.values[3].toString().trim()

                            String color1       = row.values[4].toString().trim()
                            String color2       = row.values[5].toString().trim()
                            String color3       = row.values[6].toString().trim()
                            item.color = color1 + " " + color2 + " "+ color3
                            String material1    = row.values[7].toString().trim()
                            String material2    = row.values[8].toString().trim()
                            item.material = material1 + "," + material2
                            String type1        = row.values[9].toString().trim()
                            String type2        = row.values[10].toString().trim()
                            String type3        = row.values[11].toString().trim()
                            String type4        = row.values[12].toString().trim()
                            String type5        = row.values[13].toString().trim()
                            item.itemsInLook = type1 + "," + type2 + "," + type3 + "," + type4 + "," + type5
                            String shape1       = row.values[14].toString().trim()
                            String shape2       = row.values[15].toString().trim()
                            item.shape = shape1 + "," + shape2
                            String acces1       = row.values[16].toString().trim()
                            String acces2       = row.values[17].toString().trim()
                            String acces3       = row.values[18].toString().trim()
                            String acces4       = row.values[19].toString().trim()
                            item.accessories = acces1 + "," + acces2 + "," + acces3 + "," + acces4
                            item.occasion       = row.values[20].toString().trim()
                            String style1       = row.values[21].toString().trim()
                            String style2       = row.values[22].toString().trim()
                            String style3       = row.values[23].toString().trim()
                            item.style = style1 + "," + style2 + "," + style3
                            String motif1       = row.values[24].toString().trim()
                            String motif2       = row.values[25].toString().trim()
                            String motif3       = row.values[26].toString().trim()
                            String motif4       = row.values[27].toString().trim()
                            item.motif = motif1 + "," + motif2 + "," + motif3 + "," + motif4
                            String theme1       = row.values[28].toString().trim()
                            String theme2       = row.values[29].toString().trim()
                            String theme3       = row.values[30].toString().trim()
                            String theme4       = row.values[31].toString().trim()
                            item.theme = theme1 + "," + theme2 + "," + theme3 + "," + theme4
                            item.culture        = row.values[32].toString().trim()
                            item.lookSeason     = row.values[33].toString().trim()
                            item.decade         = row.values[34].toString().trim()
                            
                            StringBuilder sb = new StringBuilder()
                            for(def i=3;i<35;i++){
                                sb.append(row.values[i].toString() + " ") 
                            }
                            item.attributes = sb.toString()
                            item.description = sb.toString()
                            item.brandCollection = BrandCollection.findOrSaveWhere(brand:brand,season:season).save()
                            String imageFile = row.values[2].toString().trim().padLeft(4,'0') + ".jpg"
                            def image = "//dvch4zq3tq7l4.cloudfront.net" + row.values[35].toString().trim().toLowerCase() + imageFile
                            log.info "image:"+ image
                            item.image = image
                            item.fromDate = new Date()
                            item.imageProvider = "indigital"
                            item.save(flush:true, failOnError: true)
                            log.info "item saved:" + item
                        }

                        
                    }
                    flash.message = "Looks added to the database."
                    redirect([action: "index"])
                }
            }
        }
    }

    def upload2() {
        if (request.method == 'POST') {
            log.info "Post to upload"
            log.info "city:"+params.city
            City city = City.findOrSaveWhere(name:params.city).save(flush:true,failOnError:true)
            def submittedFile = request.getFile('file')
            if (submittedFile.empty) {
                flash.message = 'File is mandatory.'
                response.sendError(500)
                log.error "error no file"
            } else {
                if (!(submittedFile.getContentType() == 'application/csv'
                        || submittedFile.getContentType() == 'text/csv')) {
                    flash.message = 'File must have a CSV extension.'
                    response.sendError(500)
                } else {
                    def data = parseCsv(submittedFile.getInputStream().getText())
                    SearchableItemType type = SearchableItemType.findByDisplay('Looks')
                    def count = 0
                    for (row in data) {
                        ++count
                        if(count > 2 ){ 
                            log.info "adding item"
                            SearchableItem item = new SearchableItem(type:type)
                            Brand brand = Brand.findOrSaveWhere(name:row.values[0].toString().trim()).save()
                            item.brand = brand
                            item.city = city
                            Season season = Season.findOrSaveWhere(name:row.values[1].toString().trim()).save()
                            item.season = season
                            item.name           = row.values[2].toString().trim()
                            item.sex            = row.values[3].toString().trim()

                            String color1       = row.values[4].toString().trim()
                            String color2       = row.values[5].toString().trim()
                            String color3       = row.values[6].toString().trim()
                            item.color = color1 + " " + color2 + " "+ color3
                            String material1    = row.values[7].toString().trim()
                            String material2    = row.values[8].toString().trim()
                            String material3    = row.values[9].toString().trim()
                            item.material = material1 + "," + material2 + "," + material3
                            String type1        = row.values[10].toString().trim()
                            String type2        = row.values[11].toString().trim()
                            String type3        = row.values[12].toString().trim()
                            String type4        = row.values[13].toString().trim()
                            String type5        = row.values[14].toString().trim()
                            item.itemsInLook = type1 + "," + type2 + "," + type3 + "," + type4 + "," + type5
                            String shape1       = row.values[15].toString().trim()
                            String shape2       = row.values[16].toString().trim()
                            String shape3       = row.values[17].toString().trim()
                            item.shape = shape1 + "," + shape2 + "," + shape3
                            String acces1       = row.values[18].toString().trim()
                            String acces2       = row.values[19].toString().trim()
                            String acces3       = row.values[20].toString().trim()
                            String acces4       = row.values[21].toString().trim()
                            String acces5       = row.values[22].toString().trim()
                            item.accessories = acces1 + "," + acces2 + "," + acces3 + "," + acces4+ "," + acces5
                            item.occasion       = row.values[23].toString().trim()
                            String style1       = row.values[24].toString().trim()
                            String style2       = row.values[25].toString().trim()
                            String style3       = row.values[26].toString().trim()
                            String style4       = row.values[27].toString().trim()
                            item.style = style1 + "," + style2 + "," + style3 + "," + style4
                            String motif1       = row.values[28].toString().trim()
                            String motif2       = row.values[29].toString().trim()
                            String motif3       = row.values[30].toString().trim()
                            String motif4       = row.values[31].toString().trim()
                            String motif5       = row.values[32].toString().trim()
                            item.motif = motif1 + "," + motif2 + "," + motif3 + "," + motif4 + "," + motif5
                            String theme1       = row.values[33].toString().trim()
                            String theme2       = row.values[34].toString().trim()
                            String theme3       = row.values[35].toString().trim()
                            String theme4       = row.values[36].toString().trim()
                            String theme5       = row.values[37].toString().trim()
                            item.theme = theme1 + "," + theme2 + "," + theme3 + "," + theme4 + "," + theme5
                            item.culture        = row.values[38].toString().trim()
                            item.lookSeason     = row.values[39].toString().trim()
                            item.decade         = row.values[40].toString().trim()
                            
                            StringBuilder sb = new StringBuilder()
                            for(def i=3;i<41;i++){
                                sb.append(row.values[i].toString() + " ") 
                            }
                            item.attributes = sb.toString()
                            item.description = sb.toString()
                            String rv41 = row.values[41].toString().toLowerCase()
                            if (rv41.contains('couture')) item.brandCollection = BrandCollection.findOrSaveWhere(brand:brand,season:season,category:Category.get(1)).save()
                            else if (rv41.contains("accessories")) item.brandCollection = BrandCollection.findOrSaveWhere(brand:brand,season:season,category:Category.get(2)).save()
                            else if (rv41.contains("menswear")) item.brandCollection = BrandCollection.findOrSaveWhere(brand:brand,season:season,category:Category.get(3)).save()
                            else if (rv41.contains("cruise")) item.brandCollection = BrandCollection.findOrSaveWhere(brand:brand,season:season,category:Category.get(4)).save()
                            else item.brandCollection = BrandCollection.findOrSaveWhere(brand:brand,season:season,category:Category.get(0)).save()
                            String imageFile = row.values[2].toString().trim().padLeft(4,'0') + ".jpg"
                            def image = "//dvch4zq3tq7l4.cloudfront.net" + row.values[42].toString().trim().toLowerCase() + imageFile
                            log.info "image:"+ image
                            item.image = image
                            item.fromDate = new Date()
                            item.imageProvider = "indigital"
                            item.save(flush:true, failOnError: true)
                            log.info "item saved:" + item
                        }

                        
                    }
                    flash.message = "Looks added to the database."
                    redirect([action: "index"])
                }
            }
        }
    }

    
}