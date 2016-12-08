import { inject } from 'aurelia-framework';
import { HttpClient, json } from 'aurelia-fetch-client';
import { singleton } from 'aurelia-framework';
import 'fetch';

@inject(HttpClient)
@singleton()
export class UserService {

    showIntro = true;

    constructor(http) {
        http.configure(config => {
            config
                .useStandardConfiguration();
        });
        this.http = http;
    }

    activate() {}

    dataIsDirty () {
      // reload from server
      // PERHAPS one record at a time to trigger aurelia?
    }

    // there are no calls to this function in this file. 
    // All access to users is via the implicit variable created at #37
    // All access to users from outside userService should go through this call
    getUsers() {
        console.log("getting users locally");
        var promise = new Promise((resolve, reject) => {
            if (!this.users) { // local storage if already loaded
                console.log("getting users from JSON");
                this.http.fetch('/user/connections.json')
                    .then(response => response.json())
                    .then(users => {
                        this.users = users;
                        resolve(this.users);
                    }).catch(err => reject(err));
            } else
                resolve(this.users);
        });
        return promise;

    }

    checkValidUser(email) {
        if (email == this.user.email) return (-2); // its yourself you fool
        //this.users.forEach(function(item1) {
        var i;
        for (i = 0; i < this.users.length; i++) {
            var item1 = this.users[i];
            //console.log("inner users: " + item1.email + " to match: " + email);
            if (item1.email.toUpperCase() == email.toUpperCase()) {
                //console.log("matched emails");
                return (item1.id); //return the id of the requested, valid email
            }
        };
        return (-1); // no match, sorry, you have no friends
    }

    checkDuplicateConnection(userId) {
      var i;
      var item1;
      for (i = 0; i < this.users.length; i++) {
          item1 = this.users[i];
          var j;
          var item2;
          for (j = 0; j < item1.connections.length; j++) {
            item2 = item1.connections[j];
              console.log("incoming userId: " + userId + " item2.connectedUserId: " + item2.connectedUserId + " item2.user.id: " + item2.user.id + " this.user.id: " + this.user.id);
              if ((item2.connectedUserId == this.user.id) && (item2.user.id == userId)  && (item2.connectingStatus=='Accepted')) return (-1);
              if ((item2.connectedUserId == this.user.id) && (item2.user.id == userId)  && (item2.connectingStatus=='Pending')) return (-2);
              if ((item2.connectedUserId == userId) && (item2.user.id == this.user.id)  && (item2.connectingStatus=='Accepted')) return (-1); 
              if ((item2.connectedUserId == userId) && (item2.user.id == this.user.id)  && (item2.connectingStatus=='Pending')) return (-2); 
            }
          }
          return(0);
    }

    getUserDetails(id) {
      // could replace this with users database I guess. RM for later
        // console.log("getting user details for: " + id);
        var promise = new Promise((resolve, reject) => {
            this.http.fetch('/user/show/' + id + ".json")
                .then(response => response.json())
                .then(currentContact => {
                    this.currentContact = currentContact;
                    resolve(this.currentContact);
                })
                .catch(err => reject(err));

        });
        return promise;
    }

    // Build new connection
    addContactRequest(idIn) {

        console.log("incoming contact request: " + idIn);
        var conn = { user: { id: this.user.id }, connectedUserId: idIn, numberNewMessages: 0, connectingStatus: 'Pending' };
        // locally
        this.users[this.user.id-1].connections.push(conn);
        // save out
        var promise = new Promise((resolve, reject) => {
            this.http.fetch('/connection/addContactRequest/', {
                    method: 'post',
                    body: json(conn)
                })
                .then(response => response.json())
                .then(result => {
                    console.log("fetch addContactRequest:" + result.message);
                }).catch(err => reject(err));
        });
        return promise;

    }


    addMessageCount(fromEmail) {
        // console.log("Update message count for: " + fromEmail);
        // get id for email;
        var fromUserId = this.checkValidUser(fromEmail);
            //.then (response =>  response.json ())
            //.then(fromUserId => {
                //var connectionId = -1;
                var i;
                for (i = 0; i < this.users[this.user.id - 1].connections.length; i++) {
                    if (this.users[this.user.id - 1].connections[i].connectedUserId == fromUserId) {
                        //connectionId = this.users[this.user.id - 1].connections[i].id;
                        this.users[this.user.id - 1].connections[i].numberNewMessages++;
                    }
                }
                /*
                Not sure if we have to save new messages to the server or not, as it is a transient value used in a local session and filterd on date.
                Last attempt recreated lots of server errors 
                if we do then make sure all users of addMessageCount (message.js) have .then pattern
                */
              /*             
                // save out using connection id
                if (connectionId!=-1) {
                var promise = new Promise((resolve, reject) => {
                    this.http.fetch('/connection/addMessageCount/' + connectionId, {
                            method: 'post'
                        })
                        .then(response => response.json())
                        .then(result => {
                            console.log("addMessageCount:" + result.message);
                        }).catch(err => reject(err));
                });
                return promise;
              } */
            //});
    }


    clearUnreadMessages(id) {
      // assume for the logged in user
      //need to add date stamp here
        //var connectionId = -1;
        var i;
        for (i = 0; i < this.users[this.user.id - 1].connections.length; i++) {
            if (this.users[this.user.id - 1].connections[i].connectedUserId == id) {
                this.users[this.user.id - 1].connections[i].numberNewMessages = 0;
                //connectionId = this.users[this.user.id - 1].connections[i].id;
              }
        }
        /* Again, not sure this is necessary to do on the server yet.
        // save out
        var promise = new Promise((resolve, reject) => {
            this.http.fetch('/connection/zeroMessageCount/' + connectionId, {
                    method: 'post'
                })
                .then(response => response.json())
                .then(result => {
                    console.log("zeroMessageCount:" + result.message);
                }).catch(err => reject(err));
        });
        return promise;
        */
    }


    denyContact(user, id) {
        // change staus to "Denied"
        console.log("deny contact: " + id + " from user " + user);
        //local
        var i;
        for (i = 0; i < this.users[user - 1].connections.length; i++) {
            if (this.users[user - 1].connections[i].id == id) {
                this.users[user- 1].connections[i].connectingStatus = "Denied";
              }
        }
        // write out
        var promise = new Promise((resolve, reject) => {
            this.http.fetch('/connection/denyContact/' + id, { method: 'post' }).then(response => response.json())
                .then(result => resolve(result));
        });
        return promise;
    }

    deleteContact(user, id) {
      console.log("delete contact: " + id + " from user " + user);
      // local
        var i;
        for (i = 0; i < this.users[user - 1].connections.length; i++) {
            if (this.users[user - 1].connections[i].id == id) {
                this.users[user - 1].connections.splice(i,1);
              }
        }
      //write out
        var promise = new Promise((resolve, reject) => {
            this.http.fetch('/connection/delete/' + id, { method: 'post' }).then(response => response.json())
                .then(result => resolve(result));
        });
        return promise;
    }


    acceptContact(user, id) {
      console.log("accept contact: " + id + " from user " + user);
      // local
        var i;
        for (i = 0; i < this.users[user - 1].connections.length; i++) {
            if (this.users[user - 1].connections[i].id == id) {
                this.users[user - 1].connections[i].connectingStatus = "Accepted";
              }
        }
      //write out
        var promise = new Promise((resolve, reject) => {
            this.http.fetch('/connection/acceptContact/' + id, { method: 'post' }).then(response => response.json())
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

    introShown() {
        this.showIntro = false;
    }
    show() {
        return this.showIntro;
    }


}
