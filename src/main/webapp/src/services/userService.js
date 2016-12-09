import {
    inject
} from 'aurelia-framework';
import {
    HttpClient,
    json
} from 'aurelia-fetch-client';
import {
    singleton
} from 'aurelia-framework';
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

    dataIsDirty() {
        // reload from server
        // PERHAPS one record at a time to trigger aurelia?
    }

    // there are no calls to this function in this file. 
    // All access to users is via the implicit variable created at #37
    // All access to users from outside userService should go through this call
    getUsers(forceGetFromServer) {
        console.log("getting users: forceGetFromServer: " + forceGetFromServer);
        var promise = new Promise((resolve, reject) => {
            if ((!this.users) || forceGetFromServer) { // local storage if already loaded
                console.log("getting users from JSON");
                this.http.fetch('/user/connections.json')
                    .then(response => response.json())
                    .then(users => {
                        this.users = users;
                        resolve(this.users);
                    }).catch(err => reject(err));
            } else {
                console.log("getting users lcoally");
                resolve(this.users);
            }
        });
        return promise;

    }

    checkValidUser(email) {
        if (email.toUpperCase() == this.user.email.toUpperCase()) return (-2); // its yourself you fool
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
                if ((item2.connectedUserId == this.user.id) && (item2.user.id == userId) && (item2.connectingStatus == 'Accepted')) return (-1);
                if ((item2.connectedUserId == this.user.id) && (item2.user.id == userId) && (item2.connectingStatus == 'Pending')) return (-2);
                if ((item2.connectedUserId == userId) && (item2.user.id == this.user.id) && (item2.connectingStatus == 'Accepted')) return (-1);
                if ((item2.connectedUserId == userId) && (item2.user.id == this.user.id) && (item2.connectingStatus == 'Pending')) return (-2);
            }
        }
        return (0);
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
        var conn = {
            user: {
                id: this.user.id
            },
            connectedUserId: idIn,
            numberNewMessages: 0,
            connectingStatus: 'Pending'
        };
        // locally
        this.users[this.user.id - 1].connections.push(conn);
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

    // from pubnub real-time and history
    // only messages to or from this email user are sent.
    addMessageCount(fromEmail) {
        // get id for email;
        var fromUserId = this.checkValidUser(fromEmail);
        console.log("Update message count from: " + fromEmail + " id: " + fromUserId);
        //.then (response =>  response.json ())
        //.then(fromUserId => {
        var connectionId = -1;
        var i;
        for (i = 0; i < this.users[this.user.id - 1].connections.length; i++) {
            if (this.users[this.user.id - 1].connections[i].connectedUserId == fromUserId) {
                connectionId = this.users[this.user.id - 1].connections[i].id;
                console.log("addMessageCount actually added to users from: " + fromUserId + " to: " + this.user.id);
                this.users[this.user.id - 1].connections[i].numberNewMessages++;
                break;
            }
        }
        // RM add in counts when contact initiated not by me
        if (connectionId == -1) {
            var item1;
            var item2;
            var j;
            for (i = 0; i < this.users.length; i++) {
                item1 = this.users[i];
                for (j = 0; j < item1.connections.length; j++) {
                    item2 = item1.connections[j];
                    //console.log("incoming userId: " + userId + " item2.connectedUserId: " + item2.connectedUserId + " item2.user.id: " + item2.user.id + " this.user.id: " + this.user.id);
                    if ((item2.connectedUserId == this.user.id) && (item2.user.id == fromUserId)) {
                        connectionId = this.users[item1.id - 1].connections[j].id;
                        console.log("addMessageCount actually added to users to: " + fromUserId + " to: " + this.user.id);
                        this.users[item1.id - 1].connections[j].numberNewMessages++;
                        break;
                    }
                }
            }
        }

        /*
        Not sure if we have to save new messages to the server or not, as it is a transient value used in a local session and filterd on date.
        if we do then make sure all users of addMessageCount (message.js) have .then pattern
        
        // save out using connection id
        if (connectionId != -1) {
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
          }  */ 
    }


    clearUnreadMessages(withUserId) {
        // assume for the logged in user
        //need to add date stamp here
        var connectionId1 = -1;
        var i;
        for (i = 0; i < this.users[this.user.id - 1].connections.length; i++) {
            if (this.users[this.user.id - 1].connections[i].connectedUserId == withUserId) {
                this.users[this.user.id - 1].connections[i].numberNewMessages = 0;
                connectionId1 = this.users[this.user.id - 1].connections[i].id;
                console.log("clearUnreadMessages from: " + withUserId + " on id: " + connectionId1);
                break;
            }
        }
        if (connectionId1 == -1) { // must be in connection not setup by me
            var item1;
            var item2;
            var j;
            for (i = 0; i < this.users.length; i++) {
                item1 = this.users[i];
                for (j = 0; j < item1.connections.length; j++) {
                    item2 = item1.connections[j];
                    //console.log("incoming userId: " + userId + " item2.connectedUserId: " + item2.connectedUserId + " item2.user.id: " + item2.user.id + " this.user.id: " + this.user.id);
                    if ((item2.connectedUserId == this.user.id) && (item2.user.id == withUserId)) {
                        this.users[i].connections[j].numberNewMessages = 0;
                        connectionId1 = this.users[i].connections[j].id;
                        console.log("clearUnreadMessages to: " + withUserId + " on id: " + connectionId1);
                        break;
                    }
                }
            }
        }

        /*
        Not sure if we have to save new messages to the server or not, as it is a transient value used in a local session and filterd on date. 
        if we do then make sure all users of clearUnreadMessages (message.js) have .then pattern
        */
        /* Need to switch to a date?
        // save out
        var promise = new Promise((resolve, reject) => {
            this.http.fetch('/connection/clearUnreadMessages/' + connectionId1, {
                    method: 'post'
                })
                .then(response => response.json())
                .then(result => {
                    console.log("zeroMessageCount:" + result.message);
                }).catch(err => reject(err));
        });
        return promise; */

    }

    getMostRecentRead (fromEmail) {
    // store locally
        var withUserId = this.checkValidUser(fromEmail);
        if (withUserId == -1) return (0);
        var i;
        for (i = 0; i < this.users[this.user.id - 1].connections.length; i++) {
            if (this.users[this.user.id - 1].connections[i].connectedUserId == withUserId) {
                console.log("getMostRecentRead from: " + withUserId + " on id: " + " stamp: " + this.users[this.user.id - 1].connections[i].mostRecentRead);
                return(this.users[this.user.id - 1].connections[i].mostRecentRead);
            }
        }
            var item1;
            var item2;
            var j;
            for (i = 0; i < this.users.length; i++) {
                item1 = this.users[i];
                for (j = 0; j < item1.connections.length; j++) {
                    item2 = item1.connections[j];
                    //console.log("incoming userId: " + userId + " item2.connectedUserId: " + item2.connectedUserId + " item2.user.id: " + item2.user.id + " this.user.id: " + this.user.id);
                    if ((item2.connectedUserId == this.user.id) && (item2.user.id == withUserId)) {
                        console.log("getMostRecentRead from: " + withUserId + " on id: " +  " stamp: " + item2.mostRecentRead);
                        return(item2.mostRecentRead);
                    }
                }
            }

      return (0);
    }

    saveMostRecentRead (withUserId, mostRecentDateStamp) {
    // once only for each connection
    // store locally
        var connectionId1 = -1;
        var i;
        for (i = 0; i < this.users[this.user.id - 1].connections.length; i++) {
            if (this.users[this.user.id - 1].connections[i].connectedUserId == withUserId) {
                this.users[this.user.id - 1].connections[i].mostRecentRead = mostRecentDateStamp;
                connectionId1 = this.users[this.user.id - 1].connections[i].id;
                console.log("saveMostRecentRead from: " + withUserId + " on id: " + connectionId1 + " stamp: " + mostRecentDateStamp);
                break;
            }
        }
        if (connectionId1 == -1) { // must be in connection not setup by me
            var item1;
            var item2;
            var j;
            for (i = 0; i < this.users.length; i++) {
                item1 = this.users[i];
                for (j = 0; j < item1.connections.length; j++) {
                    item2 = item1.connections[j];
                    //console.log("incoming userId: " + userId + " item2.connectedUserId: " + item2.connectedUserId + " item2.user.id: " + item2.user.id + " this.user.id: " + this.user.id);
                    if ((item2.connectedUserId == this.user.id) && (item2.user.id == withUserId)) {
                        this.users[i].connections[j].mostRecentRead = mostRecentDateStamp;
                        connectionId1 = this.users[i].connections[j].id;
                        console.log("saveMostRecentRead to: " + withUserId + " on id: " + connectionId1 + " with: " + mostRecentDateStamp);
                        break;
                    }
                }
            }
        }    
        // save out using connection id
        if (connectionId1 != -1) {
            var payload = {mostRecentRead: JSON.stringify(mostRecentDateStamp)};
            var promise = new Promise((resolve, reject) => {
                this.http.fetch('/connection/saveMostRecentRead/' + connectionId1, {
                        method: 'post',
                        body: json(payload)
                    })
                    .then(response => response.json())
                    .then(result => {
                        console.log("saveMostRecentRead: " + result.message);
                    }).catch(err => reject(err));
            });
            return promise;
          }  

    }


    denyContact(user, id) {
        // change staus to "Denied"
        console.log("deny contact: " + id + " from user " + user);
        //local
        var i;
        for (i = 0; i < this.users[user - 1].connections.length; i++) {
            if (this.users[user - 1].connections[i].id == id) {
                this.users[user - 1].connections[i].connectingStatus = "Denied";
            }
        }
        // write out
        var promise = new Promise((resolve, reject) => {
            this.http.fetch('/connection/denyContact/' + id, {
                    method: 'post'
                }).then(response => response.json())
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
                this.users[user - 1].connections.splice(i, 1);
            }
        }
        //write out
        var promise = new Promise((resolve, reject) => {
            this.http.fetch('/connection/delete/' + id, {
                    method: 'post'
                }).then(response => response.json())
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
            this.http.fetch('/connection/acceptContact/' + id, {
                    method: 'post'
                }).then(response => response.json())
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