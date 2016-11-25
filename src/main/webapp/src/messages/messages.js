export class Messages {

	messages = [];

	currentContact = '';

	// The Realtime client connection ////
	ortcClient;

  	// The Realtime channel
  	chatChannel = "chat";

	constructor () {

	    this.connectToRealtime();
	}

	activate () {
		this.messages.push ( 
		{
		text:"Hello this is a message from binding 1",
		time:"15 Sept, 15:58",
		image:"/assets/looks/1.jpg",
		fromName:"Sender1",
		fromId: myId,
		fromMe: true
		});

		this.messages.push(
		{
		text:"Hello this is a message from binding 2",
		time:"16 Sept, 15:58",
		image:"/assets/looks/2.jpg",
		fromName:"Sender2",
		fromId:"ID_02",
		fromMe: false
		});

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
				    					fromName: 'testname',
				    					fromId: receivedMessage.id,
				    					fromMe: (receivedMessage.id == myId)});
				    
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
    var message = {
      id: myId,
      text: $("#msgInput").val(),
      sentAt: new Date().toLocaleTimeString()
    };
    
    this.ortcClient.send(this.chatChannel, JSON.stringify(message));
    
    // clear the input field
    $('#msgInput').val("");
  }

  setCurrentContact (id) {
  	this.currentContact = id;
  }

}

   // The current user id (random between 1 and 1000)
	var myId = "ID_" + Math.floor((Math.random() * 1000) + 1);


