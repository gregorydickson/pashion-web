import { HttpClient } from 'aurelia-fetch-client';
import 'fetch';
import { inject, TaskQueue } from 'aurelia-framework';
import { DateFormat } from 'common/dateFormat';
import { UserService } from 'services/userService';
import { singleton } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { PubNubService } from 'services/pubNubService';
import { DialogService } from 'aurelia-dialog';
import { CreateDialogAlert } from 'common/dialogAlert';
import { DS } from 'datastores/ds';

@inject(HttpClient, UserService, EventAggregator, PubNubService, DialogService, DS, TaskQueue) 
@singleton()
export class Messages {

    messages = [];
    allMessages = {};
    user = {};
    currentContact = {};
    searchTerm = ''; // hard wired search goes here

    fetchTimeStamps = {};

    //pubnub
    pubnub;

    constructor(http, userService, eventAggregator, pubNubService, dialogService, DS, taskQueue) {  
      this.http = http;
      this.userService = userService;
      this.ea = eventAggregator;
      //this.boundHandlerComms = this.handleKeyInput.bind(this);
      this.pubNubService = pubNubService;
      this.dialogService = dialogService;
      this.ds = DS;
      this.user = this.ds.user.user;
      this.taskQueue = taskQueue;
    }

    detached() {
        console.log("detached messages");
        //window.removeEventListener('keypress', this.boundHandlerComms);
    }

    activate() {

        console.log("activated messages");
    }

    alertHold (message){
        console.log ("Messages DOWN called: this.controller: " + this.controller);
        if (this.controller) {
            this.controller.cancel(true);
            this.controller = null;
        }
        this.dialogService.openAndYieldController({ viewModel: CreateDialogAlert, model: {title:"NETWORK DOWN", message:message, timeout:'none', redText:true}, 
                lock: false, ignoreTransitions:true})
        .then(controller => {
            this.controller = controller;
            console.log ("Messages DOWN afteryield: this.controller: " + this.controller);
            });
    }

    alertHoldOff (message) {
        console.log ("Messages UP called: this controller: " + this.controller);
        // this.dialogService.closeAll(); // next version of dialog
        if (this.controller) {
            this.controller.cancel(true);
            this.controller = null;
        }
        if (document.hidden) {
            console.log("Message UP document hidden no dialog");
        } else {            
            console.log("Message UP document NOT hidden, do a dialog");
            this.dialogService.open({ viewModel: CreateDialogAlert, model: {title:"NETWORK UP", message:message, timeout:5000}, 
                    lock: false, ignoreTransitions:true });
        }
    }


    handleKeyInput(event) {
        // console.log(event);
        if(event.keyCode == 13) {
            //console.log("user hit enter in comms");
            this.sendMessage();
            // clear the input field and reset the size
            $("#msgInput").val('');
            $("#msgInput").height('19px');
            return false; // don't bubble the CR
        }
        this.elementMsgInput.style.height = "1px";
        var sh = this.elementMsgInput.scrollHeight;
        this.elementMsgInput.style.height = (sh+2)+"px";
        if (sh > 67) $("#messages-inside-top").animate({scrollTop: $("#messages-inside-top").prop("scrollHeight")}, 250);
        return true; // bubble the characters
    }

    //get the history callback for this user's channels
    // all per channel, xx at at time
    getAllMessages(timetoken, channel, totalNumberOfMessages, perPage, scroll) {
            console.log (`getAllMessages: ${timetoken} ${channel} ${totalNumberOfMessages} ${perPage}`)

            if (totalNumberOfMessages < perPage) perPage = totalNumberOfMessages;              
            // save current scroll height before items added
            let scrollHeight = $("#messages-inside-top").prop("scrollHeight");

            this.pubnub.history(
            {
                channel: channel,
                reverse: false, // Setting to true will traverse the time line in reverse starting with the oldest message first.
                count: perPage, // how many items to fetch max is 100
                stringifiedTimeToken: true, //, // false is the default
                start: timetoken // start time token to fetch
                //end: '123123123133' // end timetoken to fetch
            }).then ((response) => {
                console.log("pubhub history error?" + status.error + " response.length(messages):" + response.messages.length);
                if (this.allMessages[channel] == undefined) this.allMessages[channel] = [];
                var i = response.messages.length -1;
                for (; i >= 0 ; i--) { 
                  this.allMessages[channel].unshift({
                        text: response.messages[i].entry.text,
                        time: response.messages[i].entry.sentAt,
                        image: '',
                        fromName: response.messages[i].entry.fromName,
                        fromSurname: response.messages[i].entry.fromSurname,
                        fromId: response.messages[i].entry.fromId,
                        toName: response.messages[i].entry.toName,
                        toSurname: response.messages[i].entry.toSurname,
                        toId: response.messages[i].entry.toId,
                        toMe: (response.messages[i].entry.toId == this.user.email),
                        fromMe: (response.messages[i].entry.fromId == this.user.email)
                      });

                      // get messages count + lastmessage on history 
                      if (response.messages[i].entry.toId == this.user.email) {
                        //console.log("getMostRecentRead: " + this.userService.getMostRecentRead (response.messages[i].entry.fromId));
                          // console.log("response timestamp: "+ parseInt(response.messages[i].timetoken));
                          // see if the the latest message or not
                          this.userService.updateLastMessage(response.messages[i].entry.fromId, response.messages[i].entry.text, response.messages[i].entry.sentAt, false);
                          if (parseInt(response.messages[i].timetoken) > parseInt(this.userService.getMostRecentRead (response.messages[i].entry.fromId))) {
                                //console.log("response timestamp > mostrecent read stamp");
                                // do not push to server, use flushConnectionsData instead
                                this.userService.addMessageCount(response.messages[i].entry.fromId, false);
                          }
                        }
                    }
                    // do separate server update of message count to prevent overload fetch posts
                    //  this.userService.flushConnectionsData().then( returnedBoolean  => { 
                    // recursive call of anon function until all messages retrieved
                    this.fetchTimeStamps[channel] = response.startTimeToken;
                    if ((response.messages.length == perPage) && (totalNumberOfMessages-perPage > 0))
                        this.getAllMessages(this.fetchTimeStamps[channel], channel, totalNumberOfMessages-perPage, perPage, scroll);
                    else if (scroll=='top') {   
                        this.taskQueue.queueMicroTask(() => {
                            $("#messages-inside-top").scrollTop($("#messages-inside-top").prop("scrollHeight") - scrollHeight);
                         });
                    }
                });
        }

    attached() {
        console.log("attached messages");

        this.elementMsgInput = document.getElementById("msgInput");
        //this.elementMsgInput.addEventListener('keypress', this.boundHandlerComms, false);
        //this.elementMsgInput.addEventListener('keypress', this.handleKeyInput(e), false);
        $("#msgInput").keypress((e) => {return this.handleKeyInput(e);});

        this.subscriber = this.ea.subscribe('setCurrentContact', response => {
            this.userService.getUserDetails(response.userId).then(contact => {
                this.currentContact = contact;
            });
        });

        this.pubnub = this.pubNubService.getPubNub();

        //pubnub messages listener
        this.pubnub.addListener({

            message: (m) => {
                // handle message
                var channelName = m.channel; // The channel for which the message belongs
                var channelGroup = m.subscription; // The channel group or wildcard subscription match (if exists)
                var pubTT = m.timetoken; // Publish timetoken
                var receivedMessage = m.message; // The Payload
                console.log("messages pubnub new nessage in messages on " + m.channel + " > " + m.message);
                // channel name first part is this user's email
                if (channelName.slice(0,this.user.email.length) == this.user.email ) {
                    console.log("messages cache invalidate: " + this.user.email);
                    this.allMessages[channelName].push({ // unshift?
                        text: receivedMessage.text,
                        time: receivedMessage.sentAt,
                        image: '',
                        fromName: receivedMessage.fromName,
                        fromSurname: receivedMessage.fromSurname,
                        fromId: receivedMessage.fromId,
                        toName: receivedMessage.toName,
                        toSurname: receivedMessage.toSurname,
                        toId: receivedMessage.toId,
                        toMe: (receivedMessage.toId == this.user.email),
                        fromMe: (receivedMessage.fromId == this.user.email)
                    });

                    // get messages in real time 
                    // but need to not add to count if the user is viewing this message stream
                    // kludge with combination of combination of HTML + current user
                    // if the message tab is open and fromId == current user then don't add up the messages.
                    if (receivedMessage.toId == this.user.email) {
                        //check to see if we are in a conversation with this user and if so do not update the count
                        var tabShowing = $('#tab-messages');
                        var hasTabShowing = tabShowing.hasClass('look-menu-show');
                        if (hasTabShowing && (this.currentContact.email == receivedMessage.fromId)) {}//nothing
                            // push message count to server
                        else this.userService.addMessageCount(receivedMessage.fromId, true);
                        // try some toast
                        toastr.options.timeOut = 5000;
                        toastr.options.closeButton = false;
                        toastr.options.preventDuplicates = true;
                        toastr.info('New Message from ' + receivedMessage.fromName + ' '+ receivedMessage.fromSurname);
                        this.userService.updateLastMessage(receivedMessage.fromId, receivedMessage.text, false);

                        this.taskQueue.queueMicroTask(() => {
                            $("#messages-inside-top").scrollTop($("#messages-inside-top").prop("scrollHeight"));
                        });
                        }

                    
                }
            },
            status: function(s) {
                console.log("pubnub callback status in messages:", s);
                if (s.category) {
                    if (s.category== 'PNNetworkDownCategory') {
                        //console.log("pubnub network DOWN");
                        this.alertHold("No internet connection");

                    }
                    if (s.category== 'PNNetworkUpCategory') {
                        //console.log("pubnub network UP");
                        this.alertHoldOff("Internet connection restored");
                    }
                }
            }
        });

        // pubnub subscribe to messages channel for this email
        this.pubnub.subscribe({
            channels:  this.userService.channelList(this.user.id) , // ['my_channel'],
            withPresence: true // also subscribe to presence instances.
        });

        // clear out the previous values, since we are reading them from history on pubnub server 
        this.userService.clearAllUnreadMessagesForTheCurrentUser();

        // call to get all messages for all the current user's channels
        // used to read the latest message and unread count
        // define totalNumberOfMessages to get
        // define number per page
        var allChannels = this.userService.channelList(this.user.id);
        for (let channel of allChannels) {
            this.getAllMessages(this.fetchTimeStamps[channel], channel, 50, 100, null); 
        }

        // detect scroll past top attempt to fire new messages
        $("#messages-inside-top").scroll( () => {
            if($("#messages-inside-top").scrollTop() == 0) {
               //console.log ("Top");
               // construct channel
               // ask for more blindly, if none then no biggie
                let channel = this.user.email + this.currentContact.email;
                this.getAllMessages(this.fetchTimeStamps[channel], channel, 10, 100, 'top');
            }
        });
 
    }


    isDateToday(dateIn) {
        var timeNow = new Date();
        var dateDateIn = new Date (dateIn);
        return (dateDateIn.getDate() == timeNow.getDate());
    }


    sendMessage() {
        //console.log("Sendmessage from my id:" + this.user.id + " email:" + this.user.email +
          //  " TO id:" + this.currentContact.id + " email:" + this.currentContact.email);
        //console.log ("Message Text>" + $("#msgInput").val() +"<");
        var msgIn = $("#msgInput").val().replace(/\n/g, "");
        if (msgIn =='')  return;
        var message = {
            fromId: this.user.email,
            fromName: this.user.name,
            fromSurname: this.user.surname,
            toId: this.currentContact.email,
            toName: this.currentContact.name,
            toSurname: this.currentContact.surname,
            text: msgIn,
            sentAt: new Date(),
            toMe: false,
            fromMe: false
        };


        //pubnub to user and contact user's channels
        this.pubnub.publish({
                message: message,
                channel: this.user.email + this.currentContact.email,
                sendByPost: false, // true to send via post
                storeInHistory: true, //override default storage options
                meta: { "cool": "meta" } // publish extra meta with the request
            },
            function(status, response) {
                console.log("sendMessage pubhub publish error? " + status.error + ", code: " + status.statusCode);
                if (response) console.log("sendMessage pubhub publish error? timestamp:" + response.timetoken);
                // status error analyze and respond accordingly
                // not a very coherent error code system so hard to do
                else console.log("sendMessage pubhub publish error? errorData: " + status.errorData);
            }
        );

        this.pubnub.publish({
                message: message,
                channel: this.currentContact.email + this.user.email,
                sendByPost: false, // true to send via post
                storeInHistory: true, //override default storage options
                meta: { "cool": "meta" } // publish extra meta with the request
            },
            function(status, response) {
                console.log("sendMessage pubhub publish error? " + status.error + ", code: " + status.statusCode);
                if (response) console.log("sendMessage pubhub publish error? timestamp:" + response.timetoken);
                // status error analyze and respond accordingly
                else console.log("sendMessage pubhub publish error? errorData: " + status.errorData);
            }
        );
        this.taskQueue.queueMicroTask(() => {
              $("#messages-inside-top").scrollTop($("#messages-inside-top").prop("scrollHeight"));
            });
    }

    filterFunc(searchExpression, value){
     
     let itemValue = value.text;
     if(!searchExpression || !itemValue) return false;
     
     return itemValue.toUpperCase().indexOf(searchExpression.toUpperCase()) !== -1;
     
  }



}
