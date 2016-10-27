package pashion

class UrlMappings {

    static mappings = {
        "/$controller/$action?/$id?(.$format)?"{
            constraints {
                // apply constraints here
            }
        }

        "/searchableItems"(resources:'searchableItem')

        "/"(controller:"dashboard",action:"index")
        "500"(view:'/error')
        "404"(view:'/notFound')
    }
}
