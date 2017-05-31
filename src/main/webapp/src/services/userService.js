import {    inject,    observable} from 'aurelia-framework';
import {    HttpClient,    json} from 'aurelia-fetch-client';
import {    singleton} from 'aurelia-framework';
import 'fetch';
import {    EventAggregator} from 'aurelia-event-aggregator';
@inject(HttpClient, EventAggregator)
@singleton()
export class UserService {

    // THis version implements two records ("connectins") for each user to user connection,
    // one each with a user set to each participant, with the other user set in connectedIUserd

    showIntro = true;
    @observable user = null;
    constructor(http, EventAggregator) {
        http.configure(config => {
            config
                .useStandardConfiguration();
        });
        this.http = http;
        this.eventAggregator = EventAggregator;
    }

    activate() {}

    // Lets keep the datastore user in sync with this local user
    userChanged(newValue, oldValue) {
        if (newValue) {
            this.eventAggregator.publish('UserService.GetUser', newValue);
        }
    }

    // there are no calls to this function in this file. 
    // All access to users is via the implicit variable created at #36
    // All access to users from outside userService should go through this call
    getUsers(forceGetFromServer) {
        // console.log("UserService.getUsers, forceGetFromServer: " + forceGetFromServer);
        var promise = new Promise((resolve, reject) => {
            if ((!this.users) || forceGetFromServer) { // local storage if already loaded
                console.log("UserService.getUsers, getting users from /user/connections");
                this.http.fetch('/user/connections')
                    .then(response => response.json())
                    .then(users => {
                        this.users = users;
                        // need to zero saved message count as about to re create it from pubnub
                        // do it in getAllMessages in messages
                        resolve(this.users);
                    }).catch(err => reject(err));
            } else {
                console.log("UserService.getUsers() getting users locally");
                resolve(this.users);
            }
        });
        return promise;

    }

    getUsersByOrganization(forceGetFromServer) {
        console.log("UserService.getUsersByOrganization, forceGetFromServer: " + forceGetFromServer);
        let user = this.user;
        let method = ''
        let id = '';
        console.log("UserService.getUsersByOrganization, user :" + JSON.stringify(user));
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
        console.log("UserService.getUsersByOrganization, method for org: " + method + " id:" + id);
        var promise = new Promise((resolve, reject) => {
            if ((!this.usersOrg) || forceGetFromServer) { // local storage if already loaded
                console.log("UserService.getUsersByOrganization, getting users from /dashboard/" + method);
                this.http.fetch('/dashboard/' + method + "/" + id)
                    .then(response => response.json())
                    .then(users => {
                        this.usersOrg = users;
                        console.log("UserService.getUsersByOrganization, users for an org:" + this.usersOrg);
                        resolve(this.usersOrg);
                    }).catch(err => reject(err));
            } else {
                console.log("UserService.getUsersByOrganization, getting users locally");
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
        console.log("flushConnectionsData()");
        var parent = this;
        var promise = new Promise((resolve, reject) => {
            if (parent.users) {
                console.log("UserService.flushConnectionsData, using /user/updateConnections");
                this.http.fetch('/user/updateConnections', {
                    method: 'post',
                    body: json(parent.users)
                });
                resolve(true);
            } else {
                console.log("UserService.flushConnectionsData, no users defined");
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

    checkPassword (user, password) {
        //console.log("UserService checkPassword: " + user.email + " " + password);
        var promise = new Promise((resolve, reject) => {
            this.http.fetch('/user/checkLogin/', {
                        method: 'post',
                        body: json({email: user.email, password: password})
                    })
                    .then(response => response.json())
                    .then(result => { 
                        //onsole.log("UserService checkPassword result " + result);
                        resolve(result.status);
                    }).catch(err => reject(err));
                });
                return promise;

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
        //console.log("UserService.getUserDetails, for: " + id);
        if (!id) {
            window.location.href = '/user/login';
            return
        }
        var promise = new Promise((resolve, reject) => {
            this.http.fetch('/user/show/' + id + ".json")
                .then(response => response.json())
                .then(currentContact => {
                    this.currentContact = currentContact;
                    console.log("UserService.getUserDetails, for: " + id + "returned: " + currentContact.name);
                    resolve(this.currentContact);
                })
                .catch(err => reject(err));

        });
        return promise;
    }

    update(updateUser) {
        // this is for ANY user not necessarily the current user as can come from admin page (any user) or dialogEditcontact (current user)
        // if add fields to either need to update here
        console.log("UserService.update, incoming user:" + updateUser.id + " " + updateUser.name + " using /user/updatejson");


        // update the info into a full record
        // json side can then decide what to update
        var tempNewUser = this.users[updateUser.id - 1];
        if (updateUser.address) tempNewUser.address = updateUser.address;
        if (updateUser.name) tempNewUser.name = updateUser.name;
        if (updateUser.surname) tempNewUser.surname = updateUser.surname;
        if (updateUser.password) tempNewUser["password"] = updateUser.password;
        if (updateUser.title) tempNewUser["title"] = updateUser.title;
        if (updateUser.phone) tempNewUser["phone"] = updateUser.phone;

        // now write it out
        var promise = new Promise((resolve, reject) => {
            this.http.fetch('/user/updatejson/' + tempNewUser.id + ".json", {
                    method: 'post',
                    body: json(tempNewUser)
                })
                .then(response => response.json())
                .then(result => {
                    resolve(result)
                }).catch(err => reject(err));
        });

        // if we are updating the current login user then need to set local 
        if (this.user.id == updateUser.id) {
            //add the extra stuff
            if (tempNewUser.brand != null) {
                tempNewUser["type"] = 'brand';
                tempNewUser["companyId"] = tempNewUser.brand.id;
            } else if (tempNewUser.pressHouse != null) {
                tempNewUser["type"] = 'press';
                tempNewUser["companyId"] = tempNewUser.pressHouse.id;
            } else if (tempNewUser.prAgency != null) {
                tempNewUser["type"] = 'prAgency';
                tempNewUser["companyId"] = tempNewUser.prAgency.id;
            } else {
                tempNewUser["type"] = 'nosession';
            }
            this.user = tempNewUser;
        }

    }

    uploadAvatar(data) {
        var promise = new Promise((resolve, reject) => {
            this.http.fetch('/user/uploadAvatar/' + this.user.id + ".json", {
                    method: 'post',
                    body: JSON.stringify({
                        data: data
                    })
                })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    this.user.avatar = data.url;
                    resolve(data);
                })
                .catch(err => reject(err));
        });

        return promise;
    }

    clearAvatar() {
        this.user.avatar = null;
        var promise = new Promise((resolve, reject) => {
            this.http.fetch('/user/clearAvatar/' + this.user.id, {
                    method: 'get'
                })
                .then(response => response.json())
                .then(data => {
                    console.log();
                    resolve();
                })
                .catch(err => reject(err));
        });

        return promise;
    }

    // Build new connection
    addContactRequest(idIn) {

        console.log("UserService.addContactRequest, for id: " + idIn);
        // first connection record
        var nameString1 = this.users[this.user.id - 1].name + ' ' + this.users[this.user.id - 1].surname + this.users[this.user.id - 1].email; // spaces to match name display and prvent run on match for the other fields
        if (this.users[this.user.id - 1].brand) nameString1 += this.users[this.user.id - 1].brand.name;
        if (this.users[this.user.id - 1].pressHouse) nameString1 += this.users[this.user.id - 1].pressHouse.name;
        if (this.users[this.user.id - 1].prAgency) nameString1 += this.users[this.user.id - 1].prAgency.name;

        var nameString2 = this.users[idIn - 1].name + ' ' + this.users[idIn - 1].surname + this.users[idIn - 1].email;
        if (this.users[idIn - 1].brand) nameString2 += this.users[idIn - 1].brand.name;
        if (this.users[idIn - 1].pressHouse) nameString2 += this.users[idIn - 1].pressHouse.name;
        if (this.users[idIn - 1].prAgency) nameString2 += this.users[idIn - 1].prAgency.name;
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
                    body: json({
                        user1: conn1,
                        user2: conn2,
                        fromEmail: connectedEmail
                    }) // 
                })
                .then(response => response.json())
                .then(result => {
                    //console.log("json addContactRequest1: " + result.message);
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
        // console.log("UserService.addMessgeCount, update message count from:" + fromEmail + " id:" + fromUserId + ' pushToServer: ' + pushToServer);

        var i;
        for (i = 0; i < this.users[this.user.id - 1].connections.length; i++) {
            if (this.users[this.user.id - 1].connections[i].connectedUserId == fromUserId) {
                // console.log("UserService.addMessgeCount 1 actually added from: " + fromUserId + " to: " + this.user.id);
                this.users[this.user.id - 1].connections[i].numberNewMessages++;
                connectionId = this.users[this.user.id - 1].connections[i].id;
                break;
            }
        }


        /* Not sure if we have to save new messages to the server or not, as it is a transient value used in a local session and filterd on date.
         if we do, then make sure all users of addMessageCount (message.js) have .then pattern 

        // save out using connection id
        if (pushToServer && (connectionId != -1)) {
            console.log("UserService.addMessgeCount, pushing message count to server for: " + fromEmail + " user id: " + fromUserId + " in connections id: " + connectionId);
            var promise = new Promise((resolve, reject) => {
                this.http.fetch('/connection/addMessageCount/' + connectionId, {
                        method: 'post'
                    })
                    .then(response => response.json())
                    .then(result => {
                        console.log("UserService.addMessgeCount json addMessageCount result:" + result.message);
                    }).catch(err => reject(err));
            });
            return promise;
        }
        */
    }

    // from pubnub real-time only and not history
    // history sets pushToServer as false and uses flushConnectionsData
    // only messages to or from this email user are sent.
    updateLastMessage(fromEmail, message, pushToServer) { // add 1 to the count
        // get id for email;
        var fromUserId = this.checkValidUser(fromEmail);
        var connectionId = -1;

        var i;
        for (i = 0; i < this.users[this.user.id - 1].connections.length; i++) {
            if (this.users[this.user.id - 1].connections[i].connectedUserId == fromUserId) {
                this.users[this.user.id - 1].connections[i].lastMessage = message;
                // console.log("UserService.updateLastMessage from: " + fromUserId + " to: " + this.user.id + " message: " + message);
                connectionId = this.users[this.user.id - 1].connections[i].id;
                break;
            }
        }


        /* Not sure if we have to save new messages to the server or not, as it is a transient value used in a local session and filterd on date.
         if we do, then make sure all users of addMessageCount (message.js) have .then pattern 

        // save out using connection id
        if (pushToServer && (connectionId != -1)) {
            console.log("UserService.addMessgeCount, pushing message count to server for: " + fromEmail + " user id: " + fromUserId + " in connections id: " + connectionId);
            var promise = new Promise((resolve, reject) => {
                this.http.fetch('/connection/addMessageCount/' + connectionId, {
                        method: 'post'
                    })
                    .then(response => response.json())
                    .then(result => {
                        console.log("UserService.addMessgeCount json addMessageCount result:" + result.message);
                    }).catch(err => reject(err));
            });
            return promise;
        }
        */
    }

    clearAllUnreadMessagesForTheCurrentUser() {
        if (this.users[this.user.id - 1] == 'undefined' || 
            this.users[this.user.id - 1] == null ||
            this.users[this.user.id - 1] == '' ||
            this.users[this.user.id - 1] == undefined) { console.error ("** userService.clearAllUnreadMessagesForTheCurrentUser NO USER DEFINED in users structure **"); return;} 
        var i;
        // my connections
        if(this.users[this.user.id - 1].connections){
            for (i = 0; i < this.users[this.user.id - 1].connections.length; i++) {
                this.clearUnreadMessages(this.users[this.user.id - 1].connections[i].connectedUserId);
            }
        }
    }

    clearUnreadMessages(withUserId) {
        // assume for the logged in user
        if (this.users[this.user.id - 1] == undefined) return;
        var connectionId1 = -1;
        var i;
        if(this.users[this.user.id - 1].connections){
            for (i = 0; i < this.users[this.user.id - 1].connections.length; i++) {
                if (this.users[this.user.id - 1].connections[i].connectedUserId == withUserId) {
                    this.users[this.user.id - 1].connections[i].numberNewMessages = 0;
                    connectionId1 = this.users[this.user.id - 1].connections[i].id;
                    console.log("UserService.cleanUnreadMessages, from: " + withUserId + " on id: " + connectionId1);
                    break;
                }
            }
        }

        /*
        Not sure if we have to save new messages to the server or not, as it is a transient value used in a local session and filterd on date. 
        if we do then make sure all users of clearUnreadMessages (message.js) have .then pattern
        

        // save out
        var promise = new Promise((resolve, reject) => {
            this.http.fetch('/connection/clearUnreadMessages/' + connectionId1, {
                    method: 'post'
                })
                .then(response => response.json())
                .then(result => {
                    console.log("UserService.addMessgeCount, zeroMessageCount success from server with message: " + result.message);
                    resolve(true);
                }).catch(err => reject(err));
        });
        return promise;
        */

    }

    getMostRecentRead(fromEmail) {
        var withUserId = this.checkValidUser(fromEmail);
        if (withUserId == -1) {
            console.log("UserService.getMostRecentRead, from: " + fromEmail + " invalid email");
            return (0);
        }
        var i;
        for (i = 0; i < this.users[this.user.id - 1].connections.length; i++) {
            if (this.users[this.user.id - 1].connections[i].connectedUserId == withUserId) {
                // console.log("UserService.getMostRecentRead, from: " + withUserId + " on id: " + " stamp: " + this.users[this.user.id - 1].connections[i].mostRecentRead);
                return (this.users[this.user.id - 1].connections[i].mostRecentRead);
            }
        }
        console.log("UserService.getMostRecentRead, from: " + withUserId + " on id: " + " stamp: not found");
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
                console.log("UserService.saveMostRecentRead, from: " + withUserId + " on id: " + connectionId1 + " stamp: " + mostRecentDateStamp);
                break;
            }
        }

        // save out using connection id
        if (connectionId1 != -1) {
            var payload = {
                mostRecentRead: JSON.stringify(mostRecentDateStamp)
            };
            var promise = new Promise((resolve, reject) => {
                this.http.fetch('/connection/saveMostRecentRead/' + connectionId1, {
                        method: 'post',
                        body: json(payload)
                    })
                    .then(response => response.json())
                    .then(result => {
                        console.log("UserService.saveMostRecentRead, " + result.message);
                    }).catch(err => reject(err));
            });
            return promise;
        } else {
            console.log("UserService.saveMostRecentRead, ERROR");
            return (false);
        }

    }



    //RM need to check this code carefully as not kept up to date
    deleteContact(user, id) { // id=connection id 
        console.log("UserService.deleteContact, id: " + id + " from user " + user);
        // local
        if (typeof (id) == 'undefined') {
            console.log("UserService.deleteContact, id undefined: " + id);
            // pf = new Promise ();
            return Promise.reject(new Error('fail'));
        }
        if (typeof (user) == 'undefined') {
            console.log("UserService.deleteContact, user undefined");
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

        console.log("UserService.deleteContact, delete connection 1, id: " + id + " fromEmail: " + connectedEmail);
        var payload = {
            fromEmail: connectedEmail
        };
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
        var email2 = null; //RM signal that for 2nd delete we do NOT want to send invalidate
        payload = {
            fromEmail: email2
        };
        for (i = 0; i < this.users[connectedUserId - 1].connections.length; i++) {
            if (this.users[connectedUserId - 1].connections[i].connectedUserId == user) {
                id2 = this.users[connectedUserId - 1].connections[i].id;
                this.users[connectedUserId - 1].connections.splice(i, 1);
                break;
            }
        }
        //write out
        // make 2 calls because not sureif the standard delete should be used or not.       
        console.log("UserService.deleteContact, delete connection 2, id: " + id2 + " fromEmail: " + email2);
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

    delete(id) {

        var promise = new Promise((resolve, reject) => {

            this.http.fetch('/user/blank/' + id, {
                    method: 'delete'
                })
                .then(response => {
                    if (response.ok) {
                        resolve(response);
                    } else {
                        console.log('UserService.deleteContact, Network response was not ok.');
                        reject("Not Deleted");
                    }
                })
                .catch(err => reject(err));

        });
        return promise;

    }

    acceptContact(user, id) {
        console.log("UserService.acceptContact, " + id + " from user " + user);
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
                    body: json({
                        connectedConnId: connectedConnId,
                        fromEmail: connectedEmail
                    })
                }).then(response => response.json())
                .then(result => resolve(result));
        });
        return promise;
    }

    getUser() {
        var promise = new Promise((resolve, reject) => {
            if (!this.user) {
                console.log("UserService.getUser, no user variable, fetch json /dashboard/user");
                this.http.fetch('/dashboard/user')
                    .then(response => response.json())
                    .then(dashBoardUser => {
                        this.getUserDetails(dashBoardUser.id).then(user => {
                            // this is the extra stuff created in groovy for the login user that is now relied upon
                            //RM should weed out the places that rely on this and create specific functions here
                            
                            console.log("userService.getUser, got user " + user.name)
                            if (user.brand != null) {
                                user["type"] = 'brand';
                                user["companyId"] = user.brand.id;
                            } else if (user.pressHouse != null) {
                                user["type"] = 'press';
                                user["companyId"] = user.pressHouse.id;
                            } else if (user.prAgency != null) {
                                user["type"] = 'prAgency';
                                user["companyId"] = user.prAgency.id;
                            } else {
                                user["type"] = 'nosession';
                            }
                            user["company"] = dashBoardUser.company;
                            this.user = user;
                            resolve(this.user);
                        })
                    }).catch(err => reject(err));
            } else {
                console.log("UserService.getUser, from local: this.user:" + this.user.id + " " + this.user.name);
                resolve(this.user);
            }
        });
        return promise;
    }

    createUser(userToAdd) {
        console.log("UserService.createUser, " + userToAdd);
        console.log(JSON.stringify(this.user));
        let currentUser = this.user;

        if (currentUser.brand) {
            userToAdd.brand = currentUser.brand;
        } else if (currentUser.pressHouse) {
            userToAdd.pressHouse = currentUser.pressHouse.id;
            console.log("UserService.createUser, user presshouse" + currentUser.pressHouse.id);
        } else if (currentUser.prAgency) {
            userToAdd.prAgency = currentUser.prAgency.id;
        }
        var promise = new Promise((resolve, reject) => {

            this.http.fetch('/user/createjson/?format=json', {
                    method: 'post',
                    body: json(userToAdd)
                })
                .then(response => {
                    if (response.ok) {
                        resolve(response);
                    } else {
                        console.log('UserService.createUser, Network response was not ok.');
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