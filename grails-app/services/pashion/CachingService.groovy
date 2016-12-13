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

    def loadThemes(){
        
            def items = SearchableItem.list().collect{it.theme}
            def result = []
            items.each{
                if(it){
                    if(it.contains(",")){
                        it.split(",").each{result << it.trim().toUpperCase()}
                    } else{
                        result << it.trim().toUpperCase()
                    }
                }
            }
            result = result.unique()
            result.removeAll([""])
            return result as JSON

    }


    


          
      
}
