import { inject } from 'aurelia-framework';
import { HttpClient, json } from 'aurelia-fetch-client';
import 'fetch';

@inject(HttpClient)
export class UserService {

    showIntro = true;

    constructor(http) {
        http.configure(config => {
            config
                .useStandardConfiguration();
        });

        this.http = http;
        //console.log("Construct UserServices");
    }

    activate() {
        }
        
  	getUsers(searchText, status){
  		console.log("getting users");
  		var promise = new Promise((resolve, reject) => {
		
			this.http.fetch('/user/connections.json')
      			.then(response => response.json())
      			.then(users => {
      				this.users = users;
      				resolve(this.users);
      			}).catch(err=>reject(err));
	      	
		  });
		  return promise;
  	}

    checkValidUser (email) {
      var promise = new Promise((resolve, reject) => {
        this.http.fetch('/user/index.json')
          .then(response => response.json())
          .then(users => {
            users.forEach(function(item1) {
              //console.log("inner users: " + item1.email + " to match: " + email);
                if (item1.email == email) resolve(item1.id); //return the id of the requested, valid email
            });
            resolve(-1);
          }).catch(err=>reject(err));
        });

      return promise;
    }


  	/*
getUserDetails (id)
 {
 	return userController.index(1,id)
 }
 */

  	getUserDetails (id) {
		// console.log("getting user details for: " + id);
		var promise = new Promise((resolve, reject) => {
		this.http.fetch('/user/show/' + id + ".json")
  			.then(response => response.json())
  			.then(currentContact => {
  				this.currentContact = currentContact;
  				resolve(this.currentContact);
  			})
  			.catch(err=>reject(err));
      	
	  	});
	  	return promise;
  	} 	

    getConnections () {
    // console.log("getting user details for: " + id);
    var promise = new Promise((resolve, reject) => {
    this.http.fetch('/connection/index.json')
        .then(response => response.json())
        .then(connections => {
          this.connections = connections;
          resolve(this.connections);
        })
        .catch(err=>reject(err));
        
      });
      return promise;
    } 

    // Build new connection
    addContactRequest (idIn) {

      console.log ("incoming contact request: " + idIn); 

      var conn = {user: {id:this.user.id}, connectedUserId:idIn,numberNewMessages:0,connectingStatus:'Pending'};

      this.http.fetch('/connection/addContactRequest/', {
              method: 'post',
              body: json(conn)
            })
            .then(response => response.json())
            .then(result => {
              console.log("addContactRequest:"+result);
            });
          
    }


    denyContact (id) {
      
      var promise = new Promise((resolve, reject) => {
        this.http.fetch('/connection/denyContact/'+id, {method: 'post'}).then(response => response.json())
          .then(result => resolve(result));
      });
      return promise;
    }

    // exiting connection
    acceptContact (id) {
      
      var promise = new Promise((resolve, reject) => {
        this.http.fetch('/connection/acceptContact/'+id, {method: 'post'}).then(response => response.json())
          .then(result => resolve(result));
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

    introShown(){
      this.showIntro = false;
    }
    show(){
      return this.showIntro;
    }


}
