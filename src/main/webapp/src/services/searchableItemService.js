import {inject} from 'aurelia-framework';
import {HttpClient,json} from 'aurelia-fetch-client';
import 'fetch';

@inject(HttpClient)
export class SearchableItemService{

    items = null;

  	constructor(http) {
  	    http.configure(config => {
  	      config
  	        .useStandardConfiguration();
  	    });
  	    this.http = http;
    }

    	
  	
    //TODO: move search to this service
  	getItems(reload,params){
  		console.log("looks");
  		var promise = new Promise((resolve, reject) => {
    		if(reload || !(this.items)){
    			
      				
      			
        } else { 
          resolve(this.sampleRequests);
        }
  	      	
  		});

		  return promise;
  	}

    checkItemsAvailability(params){
      var promise = new Promise((resolve, reject) => {
        this.http.fetch('/searchableItem/checkItemsAvailability.json', {
            method: 'post',
            body: json(params)
          })
          .then(response => response.json())
          .then(items => {
              if(items.session == 'invalid'){
                  window.location.href = '/user/login';
                  return;
              }
              resolve(items);
          });

      });
      return promise;
    }



  

    

}

