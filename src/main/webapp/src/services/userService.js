import { inject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import 'fetch';

@inject(HttpClient)
export class UserService {




    constructor(http) {
        http.configure(config => {
            config
                .useStandardConfiguration();
        });

        this.http = http;
    }

    activate() {
        }
        
  	getUsers(searchText, status){
  		console.log("getting users");
  		var promise = new Promise((resolve, reject) => {
		
			this.http.fetch('/user/index.json')
      			.then(response => response.json())
      			.then(users => {
      				this.users = users;
      				resolve(this.users);
      			}).catch(err=>reject(err));
	      	
		  });
		  return promise;
  	}


    getUser() {
        var promise = new Promise((resolve, reject) => {
            if (!this.user) {
                this.http.fetch('/dashboard/user')
                    .then(response => response.json())
                    .then(user => {
                        this.user = user;
                        resolve(this.user);
                    }).catch(err => reject(err));
            } else
                resolve(this.user);
        });
        return promise;
    }


}
