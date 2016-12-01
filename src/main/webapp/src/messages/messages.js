import { HttpClient } from 'aurelia-fetch-client';
import 'fetch';
import { inject } from 'aurelia-framework';
import { DateFormat } from 'common/dateFormat';
import { UserService } from 'services/userService';
import { singleton } from 'aurelia-framework'
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(HttpClient, UserService, EventAggregator)
@singleton()
export class Messages {

    messages = [];
    user = {};
    currentContact = {};

    //pubnub
    pubnub;

    constructor(http, userService, eventAggregator) {
      this.http = http;
      this.userService = userService;
      this.user = this.userService.getUser().then(user => this.user = user);
      this.ea = eventAggregator;

      // oubnub
      this.pubnub = new PubNub({
          subscribeKey: "sub-c-dd158aea-b76b-11e6-b38f-02ee2ddab7fe",
          publishKey: "pub-c-b5b66a91-2d36-4cc1-96f3-f33188a8cc73",
          ssl: true
      });
    }

    attached() {
        this.subscriber = this.ea.subscribe('setCurrentContact', response => {
            this.userService.getUserDetails(response.userId).then(contact => {
                this.currentContact = contact;
            });
        });

        //pubnub listener
        var parent = this;
        this.pubnub.addListener({

            message: function(m) {
                // handle message
                var channelName = m.channel; // The channel for which the message belongs
                var channelGroup = m.subscription; // The channel group or wildcard subscription match (if exists)
                var pubTT = m.timetoken; // Publish timetoken
                var receivedMessage = m.message; // The Payload
                console.log("pubnub new nessage:", receivedMessage);

                parent.messages.push({
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

                $("#right-panel-body").animate({ scrollTop: $("#right-panel-body").prop("scrollHeight") }, 500);
            },
            presence: function(p) {
                // handle presence
                var action = p.action; // Can be join, leave, state-change or timeout
                var channelName = p.channel; // The channel for which the message belongs
                var occupancy = p.occupancy; // No. of users connected with the channel
                var state = p.state; // User State
                var channelGroup = p.subscription; //  The channel group or wildcard subscription match (if exists)
                var publishTime = p.timestamp; // Publish timetoken
                var timetoken = p.timetoken; // Current timetoken
                var uuid = p.uuid; // UUIDs of users who are connected with the channel
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
            sentAt: new Date().toLocaleString()
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
                console.log("pubhub error?" + status.error + " timestamp:" + response.timetoken);
            }
        );
    }



}
