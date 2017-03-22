package pashion

import groovyx.net.http.FromServer
import groovyx.net.http.HttpBuilder


class StuartService {

    static scope = "singleton"
    def uri =  'https://sandbox-api.stuart.com'

    def clientID = "a9a96844e2a2e78208b3327d03ac105f6cdf842d404cec8006c12e7969104630"
	def secret = "60d76bb547879450f03927dc501f5c2ef8d00c2188c684bc955fb06edde1f0c3"
	def token = null
     
    
    
	def newToken(){
		def newToken = null
		KeyValue.withTransaction { status ->
			def current = KeyValue.findByItemKey("stuart")
			if(current == null)
				current = new KeyValue(itemKey:'stuart')
		
			def http = HttpBuilder.configure {
		    	request.uri = uri
			}
			newToken = http.post {
	    		request.uri.path = '/oauth/token'
	    		request.contentType = 'application/x-www-form-urlencoded'
	    		request.body = [client_id:clientID,client_secret:secret,scope:'api',grant_type:'client_credentials']
	    		response.success { FromServer from, Object body ->
	        		return body.access_token
	    		}
			}
			log.info "response:"+ newToken

			current.itemValue = token
			current.save(failOnError: true, flush:true)
		}
		token = newToken
		newToken
	}

	// Recommended that we do not use this, just do a Job Quote
	def createLocation(Address address, String placeTypeId){
		if(token == null)
			token = KeyValue.findByItemKey("stuart")?.itemValue
		if(token == null)
			newToken()

		def addressStreet = address.address1 + " " + address.postalCode + " " + address.city

		def newLocation = null
	
		def http = HttpBuilder.configure {
	    	request.uri = uri
		}
		newLocation = http.post {
			request.headers['Authorization'] = 'Bearer ' + token
    		request.uri.path = '/v1/places'
    		request.contentType = 'application/x-www-form-urlencoded'
    		request.body = [placeTypeId:placeTypeId,
    						addressStreet:addressStreet,
    						contactCompany:address.company,
    						comment:address.comment,
    						contactPhone:address.contactPhone,
    						addressPostCode:address.postalCode]
    		response.success { FromServer from, Object body ->
    			log.info "Create Location id:"+body.id
    			log.info "body:"+body
        		return body.id
    		}
		}
		newLocation
	}

	/*
		Transport Type IDs (available in Paris and London)
		2	Bike	Maximum capacity of 80L (60cm x 40cm x 26cm) and 12kg
		3	Motorbike	Maximum capacity of 80L (60cm x 40cm x 26cm) and 15kg
		4	Car	Maximum capacity of 200L (50cm x 80cm x 50cm) and 50kg
		5	Cargo Bike	Electric engine-supported cargo-bikes with maximum capacity of 140L (46cm x 47cm x 68cm) and 50kg
		
		https://docs.stuart.com/#/reference/job-quotes/create-a-job-quote

	*/
	def createJobQuote(Address fromAddress, Address toAddress, ShippingEvent shippingEvent){
		if(token == null)
			token = KeyValue.findByItemKey("stuart")?.itemValue
		if(token == null)
			newToken()
		def http = HttpBuilder.configure {
	    	request.uri = uri
		}
		def nameArray = toAddress.attention.split()
		def firstName = nameArray[0]
		def lastName = ""
		if(nameArray.size() >1)
			lastName = nameArray[1]

		def destination = toAddress.address1 + " " + toAddress.postalCode + " " + toAddress.city
		def origin = fromAddress.address1 + " " + fromAddress.postalCode + " " + fromAddress.city
		def quote = http.post {
			request.headers['Authorization'] = 'Bearer ' + token
    		request.uri.path = '/v1/jobs/quotes/types'
    		request.contentType = 'application/x-www-form-urlencoded'
    		request.body = [transportTypeIds:"2,3",
					destination:destination,
					destinationContactCompany:toAddress.company,
					destinationContactFirstname:firstName,
					destinationContactLastname:lastName,
					destinationContactPhone:toAddress.contactPhone,
					origin:origin,
					originContactPhone:fromAddress.contactPhone]
    		response.success { FromServer from, Object body ->
    			log.info "body:"+body
        		return body
    		}
		}
		shippingEvent.stuartQuoteId = quote.id
		shippingEvent.save(flush:true)
	}

	/*
		{
		  "id": 13173,
		  "createdAt": "2016-05-08T12:13:22+0000",
		  "updatedAt": "2016-05-08T12:13:22+0000",
		  "mandatory": false,
		  "expirationInterval": 180,
		  "expiresAt": "2016-05-08T12:13:22+0000",
		  "clientDesiredArrivalTime": "null",
		  "lastInvitationSentAt": "null",
		  "invitationsCount": 1,
		  "comment": "null",
		  "originComment": "code: 1234, 3rd floor, front door",
		  "DestinationComment": "1st floor",
		  "clientReference": "null",
		  "lastStatus": {
		    "id": 33087,
		    "createdAt": "2016-05-08T12:13:22+0000",
		    "jobStatusType": {
		      "id": 1,
		      "code": "new",
		      "name": "new"
		    },
		    "status": "new"
		  },
		  "order": "null",
		  "paymentMethod": {
		    "id": 1,
		    "name": "Wallet",
		    "code": "wallet"
		  },
		  "renewable": 1,
		  "jobType": {
		    "id": 1,
		    "code": "transport_standard",
		    "name": "Standard",
		    "pricingMethod": {}
		  },
		  "currentDelivery": "null",
		  "jobCancellation": "null",
		  "client": {
		    "id": 13173,
		    "createdAt": "2016-05-08T12:13:22+0000",
		    "email": "contact@mycompany.com",
		    "ratingAvg": "null",
		    "clientAccount": {
		      "id": 13173,
		      "createdAt": "2016-05-08T12:13:22+0000",
		      "updatedAt": "2016-05-08T12:13:22+0000",
		      "jobTimeExpiration": "null",
		      "type": "corporate"
		    },
		    "companyName": "My Company",
		    "firstname": "A",
		    "phone": "+399999999",
		    "picturePath": "null",
		    "lastname": "B",
		    "lastnameInitial": "B",
		    "referrals": [
		      {
		        "id": 356697,
		        "createdAt": "2016-05-08T12:13:22+0000",
		        "referralCode": {
		          "id": 356697,
		          "createdAt": "2016-05-08T12:13:22+0000",
		          "name": "null",
		          "code": "a2dd25f9a3",
		          "city": "null",
		          "currency": "null",
		          "seed": "null",
		          "target": 1,
		          "amount": 10,
		          "enabled": true,
		          "expiresAt": "null"
		        }
		      }
		    ],
		    "referral": {
		      "id": 356697,
		      "createdAt": "2016-05-08T12:13:22+0000",
		      "referralCode": {
		        "id": 356697,
		        "createdAt": "2016-05-08T12:13:22+0000",
		        "name": "null",
		        "code": "a2dd25f9a3",
		        "city": "null",
		        "currency": "null",
		        "seed": "null",
		        "target": 1,
		        "amount": 10,
		        "enabled": true,
		        "expiresAt": "null"
		      }
		    },
		    "billingAccount": {
		      "id": 12992,
		      "company": "My Company",
		      "address": "address",
		      "city": "city",
		      "zipcode": "zipcode",
		      "country": "null",
		      "vat": "vat"
		    }
		  },
		  "originPlace": {
		    "id": 356697,
		    "createdAt": "2016-05-08T12:13:22+0000",
		    "updatedAt": "2016-05-08T12:13:22+0000",
		    "name": "null",
		    "contactName": "Bob Young",
		    "contactPhone": "+33678374859",
		    "contactEmail": "contact@mycompany.com",
		    "comment": "null",
		    "address": {
		      "id": 375953,
		      "createdAt": "2016-05-08T12:13:22+0000",
		      "updatedAt": "2016-05-08T12:13:22+0000",
		      "street": "29 rue de Rivoli 75004 Paris",
		      "postcode": "08042",
		      "latitude": 41.416667,
		      "longitude": 2.177082,
		      "city": {
		        "id": 3,
		        "name": "Barcelona",
		        "code": "barcelona",
		        "timezone": "Europe/Madrid",
		        "latitude": 41.39479,
		        "longitude": 2.148768,
		        "region": {
		          "name": "Barcelona",
		          "country": {
		            "id": 3,
		            "name": "Spain",
		            "iso2Code": "ES",
		            "defaultCurrency": {
		              "name": "Euro Member Countries, Euro",
		              "isoCode": "EUR",
		              "symbol": "€",
		              "rate": 1
		            }
		          }
		        }
		      },
		      "accuracy": 1
		    },
		    "placeType": {
		      "id": 2,
		      "name": "Picking",
		      "code": "picking"
		    }
		  },
		  "destinationPlace": {
		    "id": 356697,
		    "createdAt": "2016-05-08T12:13:22+0000",
		    "updatedAt": "2016-05-08T12:13:22+0000",
		    "name": "null",
		    "contactName": "John Doe",
		    "contactPhone": "+33628046019",
		    "contactEmail": "johndoe@mymail.com",
		    "comment": "null",
		    "address": {
		      "id": 375954,
		      "createdAt": "2016-05-08T12:13:22+0000",
		      "updatedAt": "2016-05-08T12:13:22+0000",
		      "street": "5 rue d'edimbourg 75008 paris",
		      "postcode": "08025",
		      "latitude": 41.404849,
		      "longitude": 2.171311,
		      "city": {
		        "id": 3,
		        "name": "Barcelona",
		        "code": "barcelona",
		        "timezone": "Europe/Madrid",
		        "latitude": 41.39479,
		        "longitude": 2.148768,
		        "region": {
		          "name": "Barcelona",
		          "country": {
		            "id": 3,
		            "name": "Spain",
		            "iso2Code": "ES",
		            "defaultCurrency": {
		              "name": "Euro Member Countries, Euro",
		              "isoCode": "EUR",
		              "symbol": "€",
		              "rate": 1
		            }
		          }
		        }
		      },
		      "accuracy": 1
		    },
		    "placeType": {
		      "id": 3,
		      "name": "Delivering",
		      "code": "delivering"
		    }
		  },
		  "finalJobPrice": {
		    "id": 13173,
		    "originalTotalAmount": 6,
		    "finalTotalAmount": 6,
		    "cancellationPrice": 6,
		    "minPrice": "null",
		    "basePrice": "null",
		    "jobQuote": {
		      "id": 356697,
		      "createdAt": "2016-05-08T12:13:22+0000",
		      "distance": 0.38,
		      "duration": 4,
		      "durationWithTraffic": 4,
		      "polyline": "xhtxFyeeLbCoD~EuHxBcD",
		      "originPlace": {
		        "id": 356697,
		        "createdAt": "2016-05-08T12:13:22+0000",
		        "updatedAt": "2016-05-08T12:13:22+0000",
		        "name": "null",
		        "contactName": "Bob Young",
		        "contactPhone": "+33678374859",
		        "contactEmail": "contact@mycompany.com",
		        "comment": "null",
		        "address": {
		          "id": 375953,
		          "createdAt": "2016-05-08T12:13:22+0000",
		          "updatedAt": "2016-05-08T12:13:22+0000",
		          "street": "29 rue de Rivoli 75004 Paris",
		          "postcode": "08042",
		          "latitude": 41.416667,
		          "longitude": 2.177082,
		          "city": {
		            "id": 3,
		            "name": "Barcelona",
		            "code": "barcelona",
		            "timezone": "Europe/Madrid",
		            "latitude": 41.39479,
		            "longitude": 2.148768,
		            "region": {
		              "name": "Barcelona",
		              "country": {
		                "id": 3,
		                "name": "Spain",
		                "iso2Code": "ES",
		                "defaultCurrency": {
		                  "name": "Euro Member Countries, Euro",
		                  "isoCode": "EUR",
		                  "symbol": "€",
		                  "rate": 1
		                }
		              }
		            }
		          },
		          "accuracy": 1
		        },
		        "placeType": {
		          "id": 2,
		          "name": "Picking",
		          "code": "picking"
		        }
		      },
		      "destinationPlace": {
		        "id": 356697,
		        "createdAt": "2016-05-08T12:13:22+0000",
		        "updatedAt": "2016-05-08T12:13:22+0000",
		        "name": "null",
		        "contactName": "John Doe",
		        "contactPhone": "+33628046019",
		        "contactEmail": "johndoe@mymail.com",
		        "comment": "null",
		        "address": {
		          "id": 375954,
		          "createdAt": "2016-05-08T12:13:22+0000",
		          "updatedAt": "2016-05-08T12:13:22+0000",
		          "street": "5 rue d'edimbourg 75008 paris",
		          "postcode": "08025",
		          "latitude": 41.404849,
		          "longitude": 2.171311,
		          "city": {
		            "id": 3,
		            "name": "Barcelona",
		            "code": "barcelona",
		            "timezone": "Europe/Madrid",
		            "latitude": 41.39479,
		            "longitude": 2.148768,
		            "region": {
		              "name": "Barcelona",
		              "country": {
		                "id": 3,
		                "name": "Spain",
		                "iso2Code": "ES",
		                "defaultCurrency": {
		                  "name": "Euro Member Countries, Euro",
		                  "isoCode": "EUR",
		                  "symbol": "€",
		                  "rate": 1
		                }
		              }
		            }
		          },
		          "accuracy": 1
		        },
		        "placeType": {
		          "id": 3,
		          "name": "Delivering",
		          "code": "delivering"
		        }
		      },
		      "currency": {
		        "name": "Euro Member Countries, Euro",
		        "isoCode": "EUR",
		        "symbol": "€",
		        "rate": 1
		      },
		      "originalTotalAmount": 6,
		      "finalTotalAmount": 6,
		      "cancellationPrice": 6,
		      "minPrice": 0,
		      "basePrice": 0,
		      "expireAt": "2016-05-08T12:22:58+0000"
		    },
		    "currency": {
		      "name": "Euro Member Countries, Euro",
		      "isoCode": "EUR",
		      "symbol": "€",
		      "rate": 1
		    }
		  },
		  "transportType": {
		    "id": 1,
		    "name": "Walk",
		    "code": "walk",
		    "defaultMaxPackageWidthCm": 15,
		    "defaultMaxPackageHeightCm": 10,
		    "defaultMaxPackageLengthCm": 30,
		    "defaultGeolocateMeters": 50,
		    "defaultMaxPackageWeightKg": 2,
		    "speedRatio": 1,
		    "speed": 3
		  },
		  "packageType": "null",
		  "picturePath": "null",
		  "clientRating": "null",
		  "platformTransactions": [],
		  "status": "new"
		}
	*/
	def createJob(String quoteId, Address fromAddress,
					 Address toAddress, ShippingEvent shippingEvent){

		if(token == null)
			token = KeyValue.findByItemKey("stuart")?.itemValue
		if(token == null)
			newToken()

		def destination = toAddress.address1 + " " + toAddress.postalCode + " " + toAddress.city
		def origin = fromAddress.address1 + " " + fromAddress.postalCode + " " + fromAddress.city
		def job = http.post {
			request.headers['Authorization'] = 'Bearer ' + token
    		request.uri.path = '/v1/jobs'
    		request.contentType = 'application/x-www-form-urlencoded'
    		request.body = [
    				jobQuoteId:quoteId,
    				clientReference:shippingEvent.id,
    				destinationComment:toAddress.comment,
    				originComment:fromAddress.comment,
    				pickupAt:sampleRequest.pickupDate.format("yyyy-MM-dd'T'HH:mm:ss'Z'", TimeZone.getTimeZone("UTC"))
    				]
    		response.success { FromServer from, Object body ->
    			log.info "body:"+body
        		return body
    		}
		}
		log.info "job status:"+job.status	
		job
	}

}