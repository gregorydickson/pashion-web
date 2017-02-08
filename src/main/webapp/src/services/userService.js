import { inject } from 'aurelia-framework';
import { HttpClient, json } from 'aurelia-fetch-client';
import { singleton } from 'aurelia-framework';
import 'fetch';

@inject(HttpClient)
@singleton()
export class UserService {

    // THis version implements two records ("connectins") for each user to user connection,
    // one each with a user set to each participant, with the other user set in connectedIUserd

    showIntro = true;
    user = null;
    constructor(http) {
        http.configure(config => {
            config
                .useStandardConfiguration();
        });
        this.http = http;
    }

    activate() {}

    // there are no calls to this function in this file. 
    // All access to users is via the implicit variable created at #36
    // All access to users from outside userService should go through this call
    getUsers(forceGetFromServer) {
        console.log("getting users: forceGetFromServer: " + forceGetFromServer);
        var promise = new Promise((resolve, reject) => {
            if ((!this.users) || forceGetFromServer) { // local storage if already loaded
                console.log("getUsers() getting users from JSON");
                this.http.fetch('/user/connections')
                    .then(response => response.json())
                    .then(users => {
                        this.users = users;
                        // need to zero saved message count as about to re create it from pubnub
                        // do it in getAllMessages in messages
                        resolve(this.users);
                    }).catch(err => reject(err));
            } else {
                console.log("getUsers() getting users locally");
                resolve(this.users);
            }
        });
        return promise;

    }

    getUsersByOrganization(forceGetFromServer) {
        console.log("getting users by org: forceGetFromServer: " + forceGetFromServer);
        let user = this.user;
        let method = ''
        let id = '';
        console.log(JSON.stringify(user));
        if (user.type === 'brand') {
            method = 'usersBrand';
            id = user.brand.id;
        } else if (user.type === 'press') {
            method = 'usersPressHouse';
            id = user.pressHouse.id;
        } else {
            method = 'usersPRAgency';
            id = user.prAgency.id;
        } 
        console.log("method for org:"+method + " id:"+id);
        var promise = new Promise((resolve, reject) => {
            if ((!this.usersOrg) || forceGetFromServer) { // local storage if already loaded
                console.log("getting users from JSON");
                this.http.fetch('/dashboard/'+method+"/"+id)
                    .then(response => response.json())
                    .then(users => {
                        this.usersOrg = users;
                        console.log("users for an org:"+this.usersOrg);
                        resolve(this.usersOrg);
                    }).catch(err => reject(err));
            } else {
                console.log("getting users locally");
                resolve(this.usersOrg);
            }
        });
        return promise;

    }

    // Updates the server with the current copies of all the connections 
    // Has potential for lots of flush/uploading that is irrelevant
    // used to update the server when finished updating the connections with history from pubnub
    // only in case users gets reloaded while we are in session. IE keep the server matched to the internal strucutre
    flushConnectionsData() {
        var parent = this;
        var promise = new Promise((resolve, reject) => {
            if (parent.users) {
                console.log("flushing connections to the server");
                this.http.fetch('/user/updateConnections', {
                    method: 'post',
                    body: json(parent.users)
                });
                resolve(true);
            } else {
                console.log("no users defined");
                return (false);
            }
        });
        return promise;

    }

    checkValidUser(email) {
        // return user id or an error code: -1 or -2
        if (email.toUpperCase() == this.user.email.toUpperCase()) return (-2); // its yourself you fool
        //this.users.forEach(function(item1) {
        var i;
        for (i = 0; i < this.users.length; i++) {
            var item1 = this.users[i];
            //console.log("inner users: " + item1.email + " to match: " + email);
            if (item1.email && (item1.email.toUpperCase() == email.toUpperCase())) {
                //console.log("matched emails");
                return (item1.id); //return the id of the requested, valid email. Note not "i" as index != id
            }
        };
        return (-1); // no match, sorry, you have no friends
    }

    checkDuplicateConnection(userId) {
        // Note id not email
        // errors for wrong status: -1 = already connected and -2 = pending request
        // Assume current user as one side of the match

        var j;
        var item2;
        for (j = 0; j < this.users[this.user.id - 1].connections.length; j++) {
            item2 = this.users[this.user.id - 1].connections[j];
            // console.log("incoming userId: " + userId + " item2.connectedUserId: " + item2.connectedUserId + " item2.user.id: " + item2.user.id + " this.user.id: " + this.user.id);
            if ((item2.connectedUserId == userId) && (item2.connectingStatus == 'Accepted')) return (-1);
            if ((item2.connectedUserId == userId) && (item2.connectingStatus == 'PendingIn')) return (-2);
            if ((item2.connectedUserId == userId) && (item2.connectingStatus == 'PendingOut')) return (-2);
        }
        return (0); // no duplicate
    }

    getUserDetails(id) {
        // could replace this with users database I guess. RM for later...
        console.log("getting user details for: " + id);
        if(!id) {
            window.location.href = '/user/login';
            return
        }
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

    update(updateUser) {
        // if we are updating the current login user then need to set local 
        // and add the extra stuff for the current user

        var promise = new Promise((resolve, reject) => {
            this.http.fetch('/user/updatejson/' + updateUser.id + ".json", {
                    method: 'post',
                    body: json(updateUser)
                })
                .then(response => response.json())
                .then(result => {resolve(result)}).catch(err => reject(err));
        });

    }

    uploadAvatar (user, data){
        var promise = new Promise((resolve, reject) => {
            this.http.fetch('/user/uploadAvatar/' + user.id + ".json", {
                    method: 'post',
                    body: JSON.stringify({
                            data:data
                    })
                })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    resolve(data);
                })
                .catch(err => reject(err));
        });

        return promise;
    }

    // Build new connection
    addContactRequest(idIn) {

        console.log("add contact request: " + idIn);
        // first connection record
        var nameString1 = this.users[this.user.id - 1].name + this.users[this.user.id - 1].surname + this.users[this.user.id - 1].email; // spaces to match name display and prvent run on match for the other fields
        if (this.users[this.user.id - 1].brand) nameString1 += this.users[this.user.id - 1].brand.name;
        if (this.users[this.user.id - 1].pressHouse) nameString1 += this.users[this.user.id - 1].pressHouse.name;
        if (this.users[this.user.id - 1].prAgency) nameString1 += this.users[this.user.id - 1].agency.name;

        var nameString2 = this.users[idIn - 1].name + this.users[idIn - 1].surname + this.users[idIn - 1].email;
        if (this.users[idIn - 1].brand) nameString2 += this.users[idIn - 1].brand.name;
        if (this.users[idIn - 1].pressHouse) nameString2 += this.users[idIn - 1].pressHouse.name;
        if (this.users[idIn - 1].prAgency) nameString2 += this.users[idIn - 1].agency.name;
        var conn1 = {
            user: {
                id: this.user.id
            },
            connectedUserId: idIn,
            numberNewMessages: 0,
            mostRecentRead: 0,
            name: nameString2, // for search and filter // add name of connecting to item not 'host' item
            id: 0,
            connectingStatus: 'PendingOut'
        };
        // second connection record
        var conn2 = {
            user: {
                id: idIn
            },
            connectedUserId: this.user.id,
            numberNewMessages: 0,
            mostRecentRead: 0,
            name: nameString1,
            id: 0, // need a place for the id
            connectingStatus: 'PendingIn'
        };

        // save out
        var connectedEmail = this.users[idIn - 1].email;
        parent = this;
        var promise = new Promise((resolve, reject) => {
            this.http.fetch('/connection/addContactRequest/', {
                    method: 'post',
                    body: json({ user1: conn1, user2: conn2, fromEmail: connectedEmail }) // 
                })
                .then(response => response.json())
                .then(result => {
                    console.log("json addContactRequest1: " + result.message);
                    // locally
                    conn1.id = result.id1; // add in the connection id from the create, locally
                    conn2.id = result.id2; // add in the connection id from the create, locally
                    parent.users[parent.user.id - 1].connections.push(conn1);
                    parent.users[idIn - 1].connections.push(conn2);
                }).catch(err => reject(err));
        });
        return promise;

    }

    // from pubnub real-time only and not history
    // history sets pushToServer as false and uses flushConnectionsData
    // only messages to or from this email user are sent.
    addMessageCount(fromEmail, pushToServer) { // add 1 to the count
        // get id for email;
        var fromUserId = this.checkValidUser(fromEmail);
        var connectionId = -1;
        console.log("Update message count from:" + fromEmail + " id:" + fromUserId + ' pushToServer: ' + pushToServer);

        var i;
        for (i = 0; i < this.users[this.user.id - 1].connections.length; i++) {
            if (this.users[this.user.id - 1].connections[i].connectedUserId == fromUserId) {
                console.log("addMessageCount actually added to users from: " + fromUserId + " to: " + this.user.id);
                this.users[this.user.id - 1].connections[i].numberNewMessages++;
                connectionId = this.users[this.user.id - 1].connections[i].id;
                break;
            }
        }


        /* Not sure if we have to save new messages to the server or not, as it is a transient value used in a local session and filterd on date.
         if we do, then make sure all users of addMessageCount (message.js) have .then pattern */

        // save out using connection id
        if (pushToServer && (connectionId != -1)) {
            console.log("pushing message count to server for: " + fromEmail + " user id: " + fromUserId + " in connections id: " + connectionId);
            var promise = new Promise((resolve, reject) => {
                this.http.fetch('/connection/addMessageCount/' + connectionId, {
                        method: 'post'
                    })
                    .then(response => response.json())
                    .then(result => {
                        console.log("json addMessageCount result:" + result.message);
                    }).catch(err => reject(err));
            });
            return promise;
        }
    }

    clearAllUnreadMessagesForTheCurrentUser() {
        if (this.users[this.user.id - 1] == 'undefined') return;
        var i;
        // my connections
        for (i = 0; i < this.users[this.user.id - 1].connections.length; i++) {
            this.clearUnreadMessages(this.users[this.user.id - 1].connections[i].connectedUserId);
        }
    }

    clearUnreadMessages(withUserId) {
        // assume for the logged in user
        if (this.users[this.user.id - 1] == 'undefined') return;
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

        /*
        Not sure if we have to save new messages to the server or not, as it is a transient value used in a local session and filterd on date. 
        if we do then make sure all users of clearUnreadMessages (message.js) have .then pattern
        */

        // save out
        var promise = new Promise((resolve, reject) => {
            this.http.fetch('/connection/clearUnreadMessages/' + connectionId1, {
                    method: 'post'
                })
                .then(response => response.json())
                .then(result => {
                    console.log("zeroMessageCount success from server with message: " + result.message);
                    resolve(true);
                }).catch(err => reject(err));
        });
        return promise;

    }

    getMostRecentRead(fromEmail) {
        var withUserId = this.checkValidUser(fromEmail);
        if (withUserId == -1) {
            console.log("getMostRecentRead from: " + fromEmail + " invalid email");
            return (0);
        }
        var i;
        for (i = 0; i < this.users[this.user.id - 1].connections.length; i++) {
            if (this.users[this.user.id - 1].connections[i].connectedUserId == withUserId) {
                console.log("getMostRecentRead from: " + withUserId + " on id: " + " stamp: " + this.users[this.user.id - 1].connections[i].mostRecentRead);
                return (this.users[this.user.id - 1].connections[i].mostRecentRead);
            }
        }
        console.log("getMostRecentRead from: " + withUserId + " on id: " + " stamp: not found");
        return (0);
    }

    saveMostRecentRead(withUserId, mostRecentDateStamp) {
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

        // save out using connection id
        if (connectionId1 != -1) {
            var payload = { mostRecentRead: JSON.stringify(mostRecentDateStamp) };
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
        } else {
            console.log("saveMostRecentRead: ERROR");
            return (false);
        }

    }



    //RM need to check this code carefully as not kept up to date
    deleteContact(user, id) { // id=connection id 
        console.log("delete connection, id: " + id + " from user " + user);
        // local
        if (typeof(id) == 'undefined') {
            console.log ("id undefined: " + id);
            // pf = new Promise ();
            return Promise.reject(new Error('fail'));
        }
        if (typeof(user) == 'undefined') {
            console.log ("user undefined");
            // pf = new Promise ();
            return Promise.reject(new Error('fail'));
        }

        var connectedUserId;
        var connectedEmail;
        var i;
        for (i = 0; i < this.users[user - 1].connections.length; i++) {
            if (this.users[user - 1].connections[i].id == id) {
                connectedUserId = this.users[user - 1].connections[i].connectedUserId;
                connectedEmail = this.users[connectedUserId - 1].email;
                this.users[user - 1].connections.splice(i, 1);
                break;
            }
        }

        //write out
        // make 2 calls because not sureif the standard delete should be used or not.

        console.log("delete connection, id: " + id + " fromEmail " + connectedEmail);
        var payload = { fromEmail: connectedEmail };
        var promise = new Promise((resolve, reject) => {
            this.http.fetch('/connection/delete/' + id, {
                    method: 'post',
                    body: json(payload)
                })
                //.then(response => response.json())
                //  .then(result => resolve(result));
        });
        // 2nd fllipped 
        var id2;
        var email2 = this.users[user - 1].email;
        payload = { fromEmail: email2 };
        for (i = 0; i < this.users[connectedUserId - 1].connections.length; i++) {
            if (this.users[connectedUserId - 1].connections[i].connectedUserId == user) {
                id2 = this.users[connectedUserId - 1].connections[i].id;
                this.users[connectedUserId - 1].connections.splice(i, 1);
                break;
            }
        }
        //write out
        // make 2 calls because not sureif the standard delete should be used or not.       
        console.log("delete connection, id: " + id2 + " fromEmail" + email2);
        promise = new Promise((resolve, reject) => {
            this.http.fetch('/connection/delete/' + id2, {
                    method: 'post',
                    body: json(payload)
                })
                //.then(response => response.json())
                //.then(result => resolve(result));
        });

        // not sure if I should serilize the deletes, lest's assue not for now.
        return promise;
    }

    delete(id){

        var promise = new Promise((resolve, reject) => {
            
            this.http.fetch('/user/blank/'+id,{method:'delete'})
                .then(response => {
                    if(response.ok) {
                        resolve(response);
                    } else {
                        console.log('Network response was not ok.');
                        reject("Not Deleted");
                    }
            })
            .catch(err => reject(err));
            
        });
        return promise;

    }

    acceptContact(user, id) {
        console.log("accept contact: " + id + " from user " + user);
        // local
        var i;
        var connectedUserId;
        var connectedConnId;
        var connectedEmail;
        for (i = 0; i < this.users[user - 1].connections.length; i++) {
            if (this.users[user - 1].connections[i].id == id) {
                this.users[user - 1].connections[i].connectingStatus = "Accepted";
                connectedUserId = this.users[user - 1].connections[i].connectedUserId;
                connectedEmail = this.users[connectedUserId - 1].email;
                break;
            }
        }
        for (i = 0; i < this.users[connectedUserId - 1].connections.length; i++) {
            if (this.users[connectedUserId - 1].connections[i].connectedUserId == user) {
                this.users[connectedUserId - 1].connections[i].connectingStatus = "Accepted";
                connectedConnId = this.users[connectedUserId - 1].connections[i].id;
                break;
            }
        }
        //write out
        var parent = this;
        var promise = new Promise((resolve, reject) => {
            this.http.fetch('/connection/acceptContact/' + id, {
                    method: 'post',
                    body: json({ connectedConnId: connectedConnId, fromEmail: connectedEmail })
                }).then(response => response.json())
                .then(result => resolve(result));
        });
        return promise;
    }

    getUser() {
        var promise = new Promise((resolve, reject) => {
            if (!this.user) {
                console.log("getUser(): no user fetch json");
                this.http.fetch('/dashboard/user')
                    .then(response => response.json())
                    .then(result => {
                        this.getUserDetails(result.id).then(user => {
                            // this is the extra stuff created in groovy for the login user that is now relied upon
                            //RM should weed out the places that rely on this and create specific functions here
                            this.user = user;
                            if (user.brand!=null) {
                                this.user["type"] = 'brand';
                                this.user["companyId"] = user.brand.id;
                            } else if (user.pressHouse!=null) {
                                this.user["type"] = 'press';
                                this.user["companyId"] = user.pressHouse.id;
                            } else if (user.prAgency!=null) {
                                this.user["type"] = 'prAgency';
                                this.user["companyId"] = user.prAgency.id;
                            } else {
                                this.user["type"] = 'guest';
                            }
                            resolve(this.user);
                        })
                    }).catch(err => reject(err));
            } else {
                console.log("gotUser() from local: " + this.user.id);
                resolve(this.user);
            }
        });
        return promise;
    }

    createUser(userToAdd){
        console.log("new user:"+userToAdd);
        console.log(JSON.stringify(this.user));
        let currentUser = this.user;
        
        if (currentUser.brand.id) {
            userToAdd.brand = currentUser.brand;
        } else if (currentUser.pressHouse.id) {
            userToAdd.pressHouse = currentUser.pressHouse.id;
            console.log("user presshouse"+currentUser.pressHouse.id);
        } else if (currentUser.prAgency.id) {
            userToAdd.prAgency = currentUser.prAgency.id;
        }
        var promise = new Promise((resolve, reject) => {
            
            this.http.fetch('/user/createjson/?format=json',{
                method: 'post',
                body: json(userToAdd)
            })
                .then(response => {
                    if(response.ok) {
                        resolve(response);
                    } else {
                        console.log('Network response was not ok.');
                        reject("Not Created");
                    }
            })
            .catch(err => reject(err));
            
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
