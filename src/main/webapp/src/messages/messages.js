import {HttpClient} from 'aurelia-fetch-client';
import 'fetch';
import {inject} from 'aurelia-framework';
import {DateFormat} from 'common/dateFormat';
import {UserService} from 'services/userService';
import {ContactEntryMessage} from 'contacts/contactEntryMessage';

@inject(HttpClient, UserService, ContactEntryMessage)
export class Messages {

	messages = [];
	user = {};

	// The Realtime client connection ////
	ortcClient;

  	// The Realtime channel
  	chatChannel = "chat";

	constructor (http, userService, contactEntryMessage) {

	    this.connectToRealtime();	  
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
    var onMessage = this.onChatMessage;
    var parent = this;
    loadOrtcFactory(IbtRealTimeSJType, function(factory, error) {
      parent.ortcClient = factory.createClient();
      parent.ortcClient.setClusterUrl('https://ortc-developers.realtime.co/server/ssl/2.1/');
      
      console.log("Connecting to Realtime ...");
      parent.ortcClient.connect('dUI5Hv', 'anonymousToken');

      // we need to wait for the connection to complete
      // before we subscribe the channel

       
      parent.ortcClient.onConnected = function(ortc) {
        $("#log").html("Connected");
        
        // subscribe the chat channel
        // the onChatMessage callback function will handle new messages
        parent.ortcClient.subscribe(parent.chatChannel, true, 
        	 function (ortc, channel, message) {

				    var receivedMessage = JSON.parse(message);
				    // var msgAlign = (receivedMessage.id == parent.myId ? "right" : "left");
				  
				    // format message to show on log;
				    var msgLog = receivedMessage.text + " " + receivedMessage.sentAt + " " + receivedMessage.id;

				    parent.messages.push ( 	
				    					{text: receivedMessage.text,
				    					time: receivedMessage.sentAt,
				    					image: '',
				    					fromName: parent.user.name,
				    					fromSurname: parent.user.surname,
				    					fromId: receivedMessage.id,
				    					fromMe: (receivedMessage.id == parent.user.email)});
				    
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
  	console.log("sendmessage myId: " + this.user.email);
    var message = {
      id: this.user.email,
      name: this.user.name,
      text: $("#msgInput").val() + "to >>" + this.contactEntryMessage.currentContact.email,
      sentAt: new Date().toLocaleTimeString()
    };
    
    this.ortcClient.send(this.chatChannel, JSON.stringify(message));
    
    // clear the input field
    $('#msgInput').val("");
  }



}



