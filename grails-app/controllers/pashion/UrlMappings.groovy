package pashion

class UrlMappings {

    static mappings = {
        "/$controller/$action?/$id?(.$format)?"{
            constraints {
                // apply constraints here
            }
        }

        name addBrandToAgency: "/agency/addBrand/$agency/$brand/" {
            controller = "PRAgency"
            action = "addBrand"  
        }
        name brandsForAgency: "/agency/brands/$agency" {
            controller = "PRAgency"
            action = "brands"
        }
        name agency: "/agency/show/$agency" {
            controller = "PRAgency"
            action = "showjson"
        }

        "/searchableItems"(resources:'searchableItem')

        "/"(controller:"dashboard",action:"index")
        "500"(view:'/error')
        "404"(view:'/notFound')
    }
}
