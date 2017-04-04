package pashion

import groovyx.net.http.FromServer
import groovyx.net.http.ApacheHttpBuilder
import grails.transaction.Transactional
import reactor.spring.context.annotation.*

@Transactional
@Consumer
class InDigitalService {

    static scope = "singleton"
    def uri =  'https://sandbox-api.stuart.com'

}