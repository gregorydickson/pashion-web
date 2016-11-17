package pashion

import grails.transaction.Transactional

import java.text.SimpleDateFormat

import static com.xlson.groovycsv.CsvParser.parseCsv


@Transactional(readOnly = false)
class UploadController {

    def index(){

    }

    def upload() {
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
                    SearchableItemType type = SearchableItemType.findByDisplay('Looks')

                    for (row in data) {

                        
                        SearchableItem item = new SearchableItem(type:type)
                        
                        Brand brand = Brand.findOrSaveWhere(name:row.values[0].toString().trim()).save()
                        item.brand = brand
                        Season season = Season.findOrSaveWhere(name:row.values[1].toString().trim()).save()
                        item.season = season
                        item.name           = row.values[2].toString().trim()
                        String color1       = row.values[3].toString().trim()
                        String color2       = row.values[4].toString().trim()
                        String color3       = row.values[5].toString().trim()
                        item.color = color1 + " " + color2 + " "+ color3
                        String material1    = row.values[6].toString().trim()
                        String material2    = row.values[7].toString().trim()
                        item.material = material1 + " " + material2
                        String type1        = row.values[8].toString().trim()
                        String type2        = row.values[9].toString().trim()
                        String type3        = row.values[10].toString().trim()
                        String type4        = row.values[11].toString().trim()
                        String type5        = row.values[12].toString().trim()
                        item.itemsInLook = type1 + " " + type2 + " " + type3 + " " + type4 + " " + type5
                        String shape1       = row.values[13].toString().trim()
                        String shape2       = row.values[14].toString().trim()
                        item.shape = shape1 + " " + shape2
                        String acces1       = row.values[15].toString().trim()
                        String acces2       = row.values[16].toString().trim()
                        String acces3       = row.values[17].toString().trim()
                        String acces4       = row.values[18].toString().trim()
                        item.accessories = acces1 + " " + acces2 + " " + acces3 + " " + acces4
                        item.occasion       = row.values[19].toString().trim()
                        String style1       = row.values[20].toString().trim()
                        String style2       = row.values[21].toString().trim()
                        String style3       = row.values[22].toString().trim()
                        item.style = style1 + " " + style2 + " " + style3
                        String motif1       = row.values[23].toString().trim()
                        String motif2       = row.values[24].toString().trim()
                        String motif3       = row.values[25].toString().trim()
                        String motif4       = row.values[26].toString().trim()
                        item.motif = motif1 + " " + motif2 + " " + motif3 + " " + motif4
                        String theme1       = row.values[27].toString().trim()
                        String theme2       = row.values[28].toString().trim()
                        String theme3       = row.values[29].toString().trim()
                        String theme4       = row.values[30].toString().trim()
                        item.theme = theme1 + " " + theme2 + " " + theme3 + " " + theme4
                        item.culture        = row.values[31].toString().trim()

                        item.lookSeason     = row.values[32].toString().trim()
                        item.decade         = row.values[33].toString().trim()
                        StringBuilder sb = new StringBuilder()

                        for(def i=3;i<34;i++){
                            sb.append(row.values[i].toString() + " ") 
                        }
                        
                        item.attributes = sb.toString()

                        item.brandCollection = BrandCollection.findOrSaveWhere(brand:brand,season:season).save()
                        


                        item.save(flush:true)

                        
                    }
                    flash.message = "Data added to the database."
                    redirect([action: "index"])
                }
            }
        }
    }

    
}