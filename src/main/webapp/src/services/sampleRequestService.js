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


}

