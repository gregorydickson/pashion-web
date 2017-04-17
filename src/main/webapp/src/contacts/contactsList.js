import {HttpClient} from 'aurelia-fetch-client';
import {DialogController} from 'aurelia-dialog';
import {DialogService} from 'aurelia-dialog';
import 'fetch';
import {inject} from 'aurelia-framework';
import {DateFormat} from 'common/dateFormat';
import {CreateDialogUpdatePhoto} from './dialogUpdatePhoto';
import {CreateDialogConfirmDelete} from './dialogConfirmDelete'; 
import {UserService} from 'services/userService';
import {CommsHeader} from 'comms/commsHeader';
import {EventAggregator} from 'aurelia-event-aggregator';
import { PubNubService } from 'services/pubNubService';
// import {Messages} from 'messages/messages';


@inject(HttpClient, DialogController, DialogService, UserService, CommsHeader,EventAggregator,PubNubService) //, Messages)
export class ContactsList {
	static inject = [DialogController];

  //user = {};
  //users = [];
  searchTerm = ''; // hard wired search goes here
  contactActivity = "19";
  connectString ="connect";
  currentPNTime;
  filterDirection = 'ascending';
  pubnub;

  constructor(http, controller, dialogService, userService, commsHeader, eventAggregator, pubNubService){ //} messages){
	    this.controller = controller;
	    http.configure(config => {
	      config
	        .useStandardConfiguration();
	    });
	    this.http = http;
	    this.dialogService = dialogService;
    	this.userService = userService;
    	this.commsHeader = commsHeader;
      this.ea = eventAggregator;
      this.pubNubService = pubNubService;
     // this.messages = messages;
      
	}

  attached() {


        this.pubnub = this.pubNubService.getPubNub();
        var parent = this;
        this.pubnub.time(function(status, response) {
            if (status.error) {
                console.log("pubnub time error")
                // handle error if something went wrong based on the status object
            } else {
                console.log(response.timetoken);
                parent.currentPNTime = response.timetoken;
            }
        });


        this.pubnub.addListener({

            message: function(m) {
                // handle message
                var channelName = m.channel; // The channel for which the message belongs
                var channelGroup = m.subscription; // The channel group or wildcard subscription match (if exists)
                var pubTT = m.timetoken; // Publish timetoken
                var receivedMessage = m.message; // The Payload
                console.log("pubnub new nessage in contactList on " + m.channel + " > " + m.message);

               if (channelName == parent.user.email + "_cacheInvalidate") {
                    console.log ("cache invalidate for user:"+ parent.user.email + " message " + receivedMessage);
                    // try some toast
                    toastr.options.timeOut = 5000;
                    toastr.options.closeButton = false;
                    toastr.options.preventDuplicates = true;
                    if (receivedMessage == "connections") {
                      parent.fetchGetUserUsersFromServer(); //update data structure from JSON in contact list
                      toastr.info('Connections Update'); // + receivedMessage.fromName + ' '+ receivedMessage.fromSurname);    
                    }
                    if (receivedMessage == "users") {
                      // need this as changes in dialogEditContact are done locally to the dialog and then saved to json (and locally)
                      parent.fetchGetUserUsersFromServer(); //update data structure from JSON in contact list
                      // nothing for now as appears on own local window, now remote, could be a bugtoastr.info('User Changes'); // + receivedMessage.fromName + ' '+ receivedMessage.fromSurname);    
                    }     
                    //if (receivedMessage == "requests") {
                    //  toastr.info('Requests Update'); // + receivedMessage.fromName + ' '+ receivedMessage.fromSurname);    
                    //}               
                 }
            },
            status: function(s) {
                console.log("pubnub callback status in contactList:", s);
            }
        });


        // pubnub subscribe to cache channel for this email
        // strictly perhaps should not be in this model, as only affects users, but seemed
        // convenietnt to put it here with the other listeners.
        this.pubnub.subscribe({
            channels: [ this.user.email + "_cacheInvalidate" ], 
            withPresence: true // also subscribe to presence instances.
        });


  }

	activate () {

  var forceGetFromServer = false;
	return Promise.all([
      this.user = this.userService.getUser().then(user => this.user = user),
      this.users = this.userService.getUsers(forceGetFromServer).then(users => this.users = users)
      // This version now creates two entries for each conneciton, one each with user as the id.
      // But no access to these data structures should be done here
      // All manipulations should happen in userServices.
    ]);
	}

  //keep track of new messages
  messagesYes (numberNewMessages) {
    // console.log ("messageYes called");
    return (numberNewMessages !=0 && numberNewMessages<100); 
  }
  messagesYes100 (numberNewMessages) {
     return (numberNewMessages>99); 
  }

  //keep track of new messages
  messagesYesNew (numberNewMessages) {
    var newMsg = (numberNewMessages !=0 && numberNewMessages<100);
    console.log ("messageYesNew called newMsg " + newMsg);
    return newMsg; 
  }
  messagesYesNew100 (numberNewMessages) {
    var newMsg = (numberNewMessages>99);
    console.log ("messageYesNew100 called newMsg " + newMsg);
    return newMsg; 
  }

  resetCount(connections) {
    //this.newMessageCount = 0;
    //console.log ("resetCount: " + this.newMessageCount);
    var resetNewMessages = (connections!=null);
    return resetNewMessages;
  }

  incrementCount (numberNewMessages, connectingStatus) {
    var increment = ((numberNewMessages!=0) && (connectingStatus=='Accepted'));
   /* if (increment) {
      this.newMessageCount = this.newMessageCount +1;
    }
    console.log ("incrementCount: " + this.newMessageCount);
    */
    return increment;
  }


  //RM test button & pubnub message cache invalidate response target
  fetchGetUserUsersFromServer () {
    this.userService.getUsers(true).then(users => this.users = users)
                                   .then(result => this.userService.getUser()
                                     .then(user => this.user = user)
                                     .then(result => console.log("contactlist.fetchGetUserUsersFromServer: by user: " + this.users[this.user.id-1].name + " gives back " + this.user.name)
                                    )) ;
  }

  // switch alphabetical filtering
  switchAlpha (buttonNumber) {
    if(this.filterDirection == 'ascending') this.filterDirection = 'descending';
    else this.filterDirection = 'ascending';

    var buttonChoice = document.getElementById("button" + buttonNumber);
    buttonChoice.classList.toggle("active");
  }

  // contact workflow
  contactMenu(id){
    var menu = document.getElementById('connect'+id); 
    menu.classList.toggle("look-menu-show");
     }

  acceptContact(user,id) {
    var menu = document.getElementById('connect'+id); 
    // menu.classList.toggle("look-menu-show"); // RM not necessary?
    this.userService.acceptContact(user,id)
      .then(response => {
      });
  }


  deleteContact(userId,id,deleteEmail) {

      this.dialogService.open({viewModel: CreateDialogConfirmDelete, model: deleteEmail, lock:true })
          .then(response => {
                             console.log("confirm dialog was cancelled: " + response.wasCancelled);
                             if (response.wasCancelled) return false ;
                             this.userService.deleteContact(userId,id);
                           });
          console.log("deleteContact complete");

  }

    deleteConnection(userId,id) {
     this.userService.deleteContact(userId,id);
  }


// contact lists

/*  lookEditContact(id){
    var menu = document.getElementById(id); 
    menu.classList.toggle("look-menu-show");
  } */

  closeExpand(buttonNumber) {
    var buttonChoice = document.getElementById("button" + buttonNumber);
    var panelChoice = document.getElementById("panel" + buttonNumber);
    buttonChoice.classList.toggle("active");
    panelChoice.classList.toggle("show"); 
  }

/*
  // Create dialog edit contact 
  createDialogEditContact(id) {
    var menu = document.getElementById(id); 
    menu.classList.toggle("look-menu-show");
    this.dialogService.open({viewModel: CreateDialogEditContact, model: 0 , lock:true})
      .then(response => {});
  }
*/

  // Create dialog update photo
 /* CreateDialogUpdatePhoto(id) {
    var menu = document.getElementById(id); 
    menu.classList.toggle("look-menu-show");
    this.dialogService.open({viewModel: CreateDialogUpdatePhoto, model: 0, lock:true })
      .then(response => {});
  }

    // Create dialog update photo
  updatePhoto() {
    this.dialogService.open({viewModel: CreateDialogUpdatePhoto, model: 0, lock:true })
      .then(response => {});
  }
*/
  initiateMessage (userId) { // id not email
    console.log("initiate message for current contact: " + userId);
    // clear unread messages
    var parent = this;  
    this.ea.publish('setCurrentContact', {userId: userId});
    this.commsHeader.setStatusTab(this.commsHeader.statusValues.messages);
    this.userService.clearUnreadMessages(userId).then (response => {

        this.pubnub.time(function(status, response) {
                if (status.error) {
                    console.log("pubnub time error")
                    // handle error if something went wrong based on the status object
                } else {
                    console.log(response.timetoken);
                    parent.userService.saveMostRecentRead (userId, response.timetoken); // save now
                }
            });
    });
      
  }

  filterFunc(searchExpression, value, ignore1, ingore2){
   let itemValue = value.name;
   if(!searchExpression || !itemValue) return true;
   return itemValue.toUpperCase().indexOf(searchExpression.toUpperCase()) !== -1;    
  }


}


