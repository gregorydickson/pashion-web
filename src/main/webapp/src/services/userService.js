import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import 'fetch';

@inject(HttpClient)
export class UserService{




	constructor(http) {
	    http.configure(config => {
	      config
	        .useStandardConfiguration();
	    });
	    
	    this.http = http;
  	}

  	activate() {


  	}

  	getUser(){

  		var promise = new Promise((resolve, reject) => {
  			if (!this.user) {
				this.http.fetch('/dashboard/user')
	      			.then(response => response.json())
	      			.then(user => {
	      				this.user = user;
	      				resolve(this.user);
	      			}).catch(err=>reject(err));
	      	}
			else
				resolve(this.user);
		});
		return promise;
  	}


}

