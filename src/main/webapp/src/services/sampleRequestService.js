import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import 'fetch';

@inject(HttpClient)
export class SampleRequestService{


	constructor(http) {
	    http.configure(config => {
	      config
	        .useStandardConfiguration();
	    });
	    
	    this.http = http;
  	}

  	activate() {

  	}
  	
  	getSampleRequest(id){
  		var promise = new Promise((resolve, reject) => {
			this.http.fetch('/sampleRequest/show/'+id+'.json')
	  			.then(response => response.json())
	  			.then(sampleRequest => {
	  				this.sampleRequest = sampleRequest;
	  				resolve( this.sampleRequest);
	  			}).catch(err=>reject(err));
	  		});

	  	return promise;
	      	
		
  	}

  	getSampleRequests(searchText, status){
  		console.log("getting user");

  		var promise = new Promise((resolve, reject) => {
  			if (!this.sampleRequests) {
				this.http.fetch('/sampleRequest.json?searchtext='+ encodeURI(searchText) + 
	                                      '&status=' + status)
	      			.then(response => response.json())
	      			.then(sampleRequests => {
	      				this.sampleRequests = sampleRequests;
	      				resolve(this.sampleRequests);
	      			}).catch(err=>reject(err));
	      	}
			else
				resolve(this.sampleRequests);
		});
		return promise;
  	}


  	saveSampleRequest(sr){

  		this.http.fetch('/sampleRequest/savejson', {
            method: 'post',
            body: json(sr)
          })
          .then(response => response.json())
          .then(result => {
              resolve(result);
          });
  	}


}

