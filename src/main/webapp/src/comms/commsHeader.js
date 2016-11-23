import {DialogController} from 'aurelia-dialog';
import {HttpClient,json} from 'aurelia-fetch-client';
import {DialogService} from 'aurelia-dialog';
import 'fetch';
import {inject} from 'aurelia-framework';
import {CreateDialogNewContact} from 'contacts/dialogNewContact';
import {CreateDialogImportContacts} from 'contacts/dialogImportContacts';


@inject(HttpClient, DialogController, DialogService)
export class CommsHeader {
  static inject = [DialogController];
  
  statusValues = {messages : "messages", contacts: "contacts", news : "news"};
  comms = {};
  
  constructor(http, controller, dialogService){
    this.dialogService = dialogService;
    this.controller = controller;  
    this.boundHandlerComms = this.handleKeyInput.bind(this);  
    http.configure(config => {
      config
        .useStandardConfiguration();
    });
    this.http = http;

    this.comms.status = this.statusValues.messages;
    console.log("Init comms status to " + this.comms.status);

    this.connectToRealtime();
 
  }

  activate(){
    window.addEventListener('keypress', this.boundHandlerComms, false); 
  }

  detached() {
   window.removeEventListener('keypress', this.boundHandlerComms);
  }

  attached(){
    // this.dialogService.open({viewModel: Introduction, model: "no-op" }).then(response => {});

    
  }

  setStatusTab (id) {
    var menu = document.getElementById("tab-"+ this.comms.status);
    menu.classList.toggle("look-menu-hide");
    menu.classList.toggle("look-menu-show");
  	this.comms.status = id;
    console.log("Setting comms status to " + id);
    menu = document.getElementById("tab-"+id);
    menu.classList.toggle("look-menu-show");
    menu.classList.toggle("look-menu-hide");
  }

  closeExpand(buttonNumber) {
    var buttonChoice = document.getElementById("button" + buttonNumber);
    var panelChoice = document.getElementById("panel" + buttonNumber);
    buttonChoice.classList.toggle("active");
    panelChoice.classList.toggle("show");  
  }

  submit(){
    
  }

handleKeyInput(event) {
    console.log(event);
    if(event.which == 13 && event.srcElement.id === 'msgInput') {
      console.log("user hit enter in comms");
      this.sendMessage();
    }
  }

    // Create dialog edit contact 

  createDialogNewContact(itemId) {
    this.dialogService.open({viewModel: CreateDialogNewContact, model: itemId })
      .then(response => {});
  }


  // Create dialog import contacts 

  CreateDialogImportContacts(itemId) {
    this.dialogService.open({viewModel: CreateDialogImportContacts, model: itemId })
      .then(response => {});
  }

  //ORTC

  connectToRealtime() {
    var onMessage = this.onChatMessage;
    loadOrtcFactory(IbtRealTimeSJType, function(factory, error) {
      ortcClient = factory.createClient();
      ortcClient.setClusterUrl('https://ortc-developers.realtime.co/server/ssl/2.1/');
      
      console.log("Connecting to Realtime ...");
      ortcClient.connect('dUI5Hv', 'anonymousToken');

      // we need to wait for the connection to complete
      // before we subscribe the channel
      ortcClient.onConnected = function(ortc) {
        $("#log").html("Connected");
        
        // subscribe the chat channel
        // the onChatMessage callback function will handle new messages
        ortcClient.subscribe(chatChannel, true, onMessage);
      }
    });
  }

  onChatMessage(ortc, channel, message) {
    var receivedMessage = JSON.parse(message);
    var msgAlign = (receivedMessage.id == myId ? "right" : "left");
  
    // format message to show on log
    var msgLog = "<div style='text-align:" + msgAlign + "' class='grid-block inter-message-gap align-" + msgAlign + "'>";
    msgLog += "<span>"+ receivedMessage.text + "<br><span>";
    msgLog += "<span class='time'>" + receivedMessage.sentAt + "</span></div>"
    
    // add the message to the chat log
    // $("#message-container").html($("#message-container").html() + text);
    $("#message-container").append(msgLog);
    $("#message-container-dad").animate({scrollTop: $("#message-container-dad").prop("scrollHeight")}, 500);
    console.log(msgLog);  
  }

  sendMessage() {
    var message = {
      id: myId,
      text: $("#msgInput").val(),
      sentAt: new Date().toLocaleTimeString()
    };
    
    ortcClient.send(chatChannel, JSON.stringify(message));
    
    // clear the input field
    $('#msgInput').val("");
  }


}

  // The Realtime client connection ////
  var ortcClient;

  // The Realtime channel
  var chatChannel = "chat";

    // The current user id (random between 1 and 1000)
  var myId = "ID_" + Math.floor((Math.random() * 1000) + 1);





