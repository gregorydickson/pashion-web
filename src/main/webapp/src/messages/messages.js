import { HttpClient } from 'aurelia-fetch-client';
import 'fetch';
import { inject } from 'aurelia-framework';
import { DateFormat } from 'common/dateFormat';
import { UserService } from 'services/userService';
import { singleton } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(HttpClient, UserService, EventAggregator) 
@singleton()
export class Messages {

    messages = [];
    user = {};
    currentContact = {};
    searchTerm = ''; // hard wired search goes here

    //pubnub
    pubnub;

    constructor(http, userService, eventAggregator) {  
      this.http = http;
      this.userService = userService;
      this.user = this.userService.getUser().then(user => this.user = user);
      this.ea = eventAggregator;
      this.boundHandlerComms = this.handleKeyInput.bind(this);

      // pubnub
      this.pubnub = new PubNub({
          subscribeKey: "sub-c-dd158aea-b76b-11e6-b38f-02ee2ddab7fe",
          publishKey: "pub-c-b5b66a91-2d36-4cc1-96f3-f33188a8cc73",
          ssl: true
      });
    }

    activate () {

    }

      detached() {
        window.removeEventListener('keypress', this.boundHandlerComms);
      }

    attached() {
        document.getElementById("msgInput").addEventListener('keypress', this.boundHandlerComms, false);

        this.subscriber = this.ea.subscribe('setCurrentContact', response => {
            this.userService.getUserDetails(response.userId).then(contact => {
                this.currentContact = contact;
            });
        });
        

        var parent = this;

        //pubnub messages listener
        this.pubnub.addListener({

            message: function(m) {
                // handle message
                var channelName = m.channel; // The channel for which the message belongs
                var channelGroup = m.subscription; // The channel group or wildcard subscription match (if exists)
                var pubTT = m.timetoken; // Publish timetoken
                var receivedMessage = m.message; // The Payload
                console.log("pubnub new nessage in messages:", receivedMessage);

                    parent.messages.push({ // unshift?
                        text: receivedMessage.text,
                        time: receivedMessage.sentAt,
                        image: '',
                        fromName: receivedMessage.fromName,
                        fromSurname: receivedMessage.fromSurname,
                        fromId: receivedMessage.fromId,
                        toName: receivedMessage.toName,
                        toSurname: receivedMessage.toSurname,
                        toId: receivedMessage.toId,
                        toMe: (receivedMessage.toId == parent.user.email),
                        fromMe: (receivedMessage.fromId == parent.user.email)
                    });

                    // get messages in real time 
                    // but need to not add to count if the user is viewing this message stream
                    // kludge with combination of combination of HTML + current user
                    // if the message tab is open and fromId == current user then don't add up the messages.
                    if (receivedMessage.toId == parent.user.email) {
                        //check to see if we are in a conversation with this user and if so do not update the count
                        var tabShowing = $('#tab-messages');
                        var hasTabShowing = tabShowing.hasClass('look-menu-show');
                        if (hasTabShowing && (parent.currentContact.email == receivedMessage.fromId)) {}//nothing
                            // push message count to server
                        else parent.userService.addMessageCount(receivedMessage.fromId, true);
                        }
                    $("#right-panel-body").scrollTop($("#right-panel-body").prop("scrollHeight"));

            },
            status: function(s) {
                console.log("pubnub callback status in messages:", s);
            }
        });

        // pubnub subscribe to messages channel for this email
        this.pubnub.subscribe({
            channels: [ this.user.email ], // ['my_channel'],
            withPresence: true // also subscribe to presence instances.
        });

        //get the history callback for this channel
        var getAllMessages = function (timetoken) {

            parent.pubnub.history(
            {
                channel: parent.user.email,
                reverse: true, // Setting to true will traverse the time line in reverse starting with the oldest message first.
                count: 100, // how many items to fetch max is 100
                stringifiedTimeToken: true, //, // false is the default
                start: timetoken // start time token to fetch
                //end: '123123123133' // end timetoken to fetch
            },
            function (status, response) {
                console.log("pubhub history error?" + status.error + " response.length(messages):" + response.messages.length);
                var i;
                for (i = 0; i < response.messages.length; i++) { 
                  parent.messages.push({
                        text: response.messages[i].entry.text,
                        time: response.messages[i].entry.sentAt,
                        image: '',
                        fromName: response.messages[i].entry.fromName,
                        fromSurname: response.messages[i].entry.fromSurname,
                        fromId: response.messages[i].entry.fromId,
                        toName: response.messages[i].entry.toName,
                        toSurname: response.messages[i].entry.toSurname,
                        toId: response.messages[i].entry.toId,
                        toMe: (response.messages[i].entry.toId == parent.user.email),
                        fromMe: (response.messages[i].entry.fromId == parent.user.email)
                  });

                  // get messages count on history 
                  if (response.messages[i].entry.toId == parent.user.email) {
                    //console.log("getMostRecentRead: " + parent.userService.getMostRecentRead (response.messages[i].entry.fromId));
                      // console.log("response timestamp: "+ parseInt(response.messages[i].timetoken));
                      if (parseInt(response.messages[i].timetoken) > parseInt(parent.userService.getMostRecentRead (response.messages[i].entry.fromId))) {
                            console.log("response timestamp > mostrecent read stamp");
                            // do not push to server, use flushConnectionsData instead
                            parent.userService.addMessageCount(response.messages[i].entry.fromId, false);
                      }
                    }
                }
                // do separate server update of message count to prevent overload fetch posts
                parent.userService.flushConnectionsData().then( returnedBoolean  => { 
                // recursive call of anon function until all messages retrieved
                    if (response.messages.length==100) getAllMessages(response.endTimeToken);
                });
            }
          );
        }
        // clear out the previous values, since we are reading them from history on pubnub server 
        this.userService.clearAllUnreadMessagesForTheCurrentUser();
        // recursive call to get all messages for the current user
        getAllMessages(0); 
 
    }

    handleKeyInput(event) {
        //console.log(event);
        if(event.which == 13 && event.srcElement.id === 'msgInput') {
          console.log("user hit enter in comms");
          this.sendMessage();
        }
      }

    sendMessage() {
        //console.log("Sendmessage from my id:" + this.user.id + " email:" + this.user.email +
          //  " TO id:" + this.currentContact.id + " email:" + this.currentContact.email);
        var message = {
            fromId: this.user.email,
            fromName: this.user.name,
            fromSurname: this.user.surname,
            toId: this.currentContact.email,
            toName: this.currentContact.name,
            toSurname: this.currentContact.surname,
            text: $("#msgInput").val(),
            sentAt: new Date(),
            toMe: false,
            fromMe: false
        };

        // clear the input field
        $('#msgInput').val("");

        //pubnub to user and contact user's channels
        this.pubnub.publish({
                message: message,
                channel: this.user.email,
                sendByPost: false, // true to send via post
                storeInHistory: true, //override default storage options
                meta: { "cool": "meta" } // publish extra meta with the request
            },
            function(status, response) {
                console.log("pubhub error?" + status.error + " timestamp:" + response.timetoken);
            }
        );
        this.pubnub.publish({
                message: message,
                channel: this.currentContact.email,
                sendByPost: false, // true to send via post
                storeInHistory: true, //override default storage options
                meta: { "cool": "meta" } // publish extra meta with the request
            },
            function(status, response) {
                console.log("pubhub publish error?" + status.error + " timestamp:" + response.timetoken);
            }
        );
        window.setTimeout(function () {
              $("#messages-inside-top").scrollTop($("#messages-inside-top").prop("scrollHeight"));
            },500); // major kludge to scroll messages
    }

    filterFunc(searchExpression, value){
     
     let itemValue = value.text;
     if(!searchExpression || !itemValue) return false;
     
     return itemValue.toUpperCase().indexOf(searchExpression.toUpperCase()) !== -1;
     
  }



}
