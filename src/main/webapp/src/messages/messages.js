import {HttpClient} from 'aurelia-fetch-client';
import 'fetch';
import {inject} from 'aurelia-framework';
import {DateFormat} from 'common/dateFormat';
import {UserService} from 'services/userService';
import {ContactEntryMessage} from 'contacts/contactEntryMessage';
import {singleton} from 'aurelia-framework'

@inject(HttpClient, UserService, ContactEntryMessage)
@singleton()
export class Messages {

	messages = [];
	user = {};

	// The Realtime client connection ////
	ortcClient;

  	// The Realtime channel
  	chatChannel = "PashionChat";

	constructor (http, userService, contactEntryMessage) {

	    if (typeof ortcClient === "undefined") this.connectToRealtime();	  
	    http.configure(config => {
	      config
	        .useStandardConfiguration();
	    });
	    this.http = http;
    	this.userService = userService;
    	this.user = this.userService.getUser().then(user => this.user = user);
    	this.contactEntryMessage = contactEntryMessage;
	}

	activate () {

	}

  //ORTC

  connectToRealtime() {
    //var onMessage = this.onChatMessage;
    var parent = this;
    loadOrtcFactory(IbtRealTimeSJType, function(factory, error) {
    	if (error !== null) {
     		console.log("ORTC factory error: " + error.message);
    	} else {
	      parent.ortcClient = factory.createClient();
	      parent.ortcClient.setClusterUrl('https://ortc-developers.realtime.co/server/ssl/2.1/');
	      
	      console.log("Connecting to Realtime ...");
	      parent.ortcClient.connect('dUI5Hv', 'anonymousToken');

  		}	
 
	  // we need to wait for the connection to complete
	  // before we subscribe the channel      
      parent.ortcClient.onConnected = function(ortc) {
        console.log("Connected to:" + parent.chatChannel);
        
        // subscribe the chat channel
        // the onChatMessage callback function will handle new messages
        parent.ortcClient.subscribe(parent.chatChannel, true, 
        	 function (ortc, channel, message) {

				    var receivedMessage = JSON.parse(message);
				    // var msgAlign = (receivedMessage.id == parent.myId ? "right" : "left");
				  
				    // format message to show on log;
				    var msgLog = receivedMessage.text + " " + receivedMessage.sentAt + " from:" + receivedMessage.fromId + " to:" + receivedMessage.toId;

				    parent.messages.push ( 	
				    					{text: receivedMessage.text,
				    					time: receivedMessage.sentAt,
				    					image: '',
				    					fromName: receivedMessage.fromName,
				    					fromSurname: receivedMessage.fromSurname,
				    					fromId: receivedMessage.fromId,
				    					toName: receivedMessage.toName,
				    					toSurname: receivedMessage.toSurname,
				    					toId: receivedMessage.toId,
				    					toMe: (receivedMessage.toId == parent.user.email),
				    					fromMe: (receivedMessage.fromId == parent.user.email)});
				    
				    // add the message to the chat log
				    // $("#message-container").html($("#message-container").html() + text);
				    // $("#message-container").append(msgLog);
				    // $("#message-container-dad").animate({scrollTop: $("#message-container-dad").prop("scrollHeight")}, 500);
				    console.log(msgLog); 
        	}
       ); 
      }


    });
  }

  sendMessage() {
  	console.log("Sendmessage from my id:" + this.user.id + " email:" + this.user.email + 
  		" TO id:" + this.contactEntryMessage.currentContact.id + " email:" + this.contactEntryMessage.currentContact.email);
    var message = {
      fromId: this.user.email,
      fromName: this.user.name,
      fromSurname: this.user.surname,
      toId: this.contactEntryMessage.currentContact.email,
      toName: this.contactEntryMessage.currentContact.name,
      toSurname:  this.contactEntryMessage.currentContact.surname,
      text: $("#msgInput").val(),
      sentAt: new Date().toLocaleString()
    };

    this.ortcClient.send(this.chatChannel, JSON.stringify(message));
    
    // clear the input field
    $('#msgInput').val("");
  }



}



