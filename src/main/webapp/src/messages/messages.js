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
    currentPNTime;

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
        

        //pubnub listener
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
                console.log("pubnub new nessage:", receivedMessage);

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
                // RM but filter on date/time stamp of last view
                // only counting messages from others
                if (receivedMessage.toId == parent.user.email) parent.userService.addMessageCount(receivedMessage.fromId);

                $("#right-panel-body").scrollTop($("#right-panel-body").prop("scrollHeight"));
            },
            status: function(s) {
                console.log("pubnub callback status:", s);
            }
        });

        // pubnub subscribe to channels
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
                  // RM but filter on date/time stamp of last view
                  if (response.messages[i].entry.toId == parent.user.email) {
                    //console.log("getMostRecentRead: " + parent.userService.getMostRecentRead (response.messages[i].entry.fromId));
                      if (response.messages[i].timetoken > parent.userService.getMostRecentRead (response.messages[i].entry.fromId))
                            parent.userService.addMessageCount(response.messages[i].entry.fromId);
                    }
                }
                // recursive call of anon function until all messages retrieved
                if (response.messages.length==100) getAllMessages(response.endTimeToken);
            }
          );
        }
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
            sentAt: new Date().toLocaleString(),
            toMe: false,
            fromMe: false
        };

        // clear the input field
        $('#msgInput').val("");

        //pubnub to user and contact channels
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
