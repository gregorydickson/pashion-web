package pashion
import pashion.SearchableItem
import org.json.*
import javax.annotation.PostConstruct
import grails.transaction.Transactional
import grails.converters.JSON

import static java.util.concurrent.TimeUnit.*
import static grails.async.Promises.*
import grails.async.Promise


@Transactional
class CachingService {

    static lazyInit = false
    
    def seasons
    def themes

    @PostConstruct
    void init() {
        
        
    }

    def themes(){
        if(!themes){
            def result = loadThemes()
            themes = result
            return result
        }
        themes
    }
    def seasons(){
        if(!seasons){
            def result = loadSeasons()
            seasons = result
            return result
        }
        seasons
    }

    def loadThemes(){
        
        def items = SearchableItem.list().collect{it.theme}
        def result = []
        items.each{
            if(it){
                if(it.contains(",")){
                    it.split(",").each{result << it.trim().toLowerCase().capitalize()}
                } else{
                    result << it.trim().toLowerCase().capitalize()
                }
            }
        }
        result = result.unique().sort()
        result.removeAll([""])
        return result as JSON
    }

    def loadSeasons(){
        List items = SearchableItem.list().collect{it.season.name}

        items.unique()
        log.info"seasons"+items
        return items as JSON

    }

    


          
      
}
