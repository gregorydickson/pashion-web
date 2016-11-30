import {DialogController} from 'aurelia-dialog';
import {HttpClient,json} from 'aurelia-fetch-client';
import {DialogService} from 'aurelia-dialog';
import 'fetch';
import {inject} from 'aurelia-framework';
import {singleton} from 'aurelia-framework';
import {CreateDialogNewContact} from 'contacts/dialogNewContact';
import {CreateDialogImportContacts} from 'contacts/dialogImportContacts';
import {Messages} from 'messages/messages';


@inject(HttpClient, DialogController, DialogService, Messages)
@singleton()
export class CommsHeader {
  static inject = [DialogController];

 statusValues = {messages : "messages", contacts: "contacts", news : "news"};
  comms = {};
  
  constructor(http, controller, dialogService, messages){
    this.dialogService = dialogService;
    this.controller = controller;  
    this.boundHandlerComms = this.handleKeyInput.bind(this);  
    http.configure(config => {
      config
        .useStandardConfiguration();
    });
    this.http = http;
    this.messages = messages;

    this.comms.status = this.statusValues.contacts;
    console.log("Init comms status to " + this.comms.status);
 
  }

  activate(){
    window.addEventListener('keypress', this.boundHandlerComms, false); 
  }

  detached() {
   window.removeEventListener('keypress', this.boundHandlerComms);
  }


  setStatusTab (id) {
    if (this.comms.status != this.statusValues.messages)
      this.rememberScroll = $("#right-panel-body").scrollTop();
    var menuHeads = document.getElementById("tab-"+ this.comms.status);  
    var menuBodies = document.getElementById("tab-"+ this.comms.status + "-body");
    menuHeads.classList.toggle("look-menu-hide");
    menuHeads.classList.toggle("look-menu-show");
    menuBodies.classList.toggle("look-menu-hide");
    menuBodies.classList.toggle("look-menu-show");
  	this.comms.status = id;
    menuHeads = document.getElementById("tab-"+id);
    menuBodies = document.getElementById("tab-"+id+ "-body");
    menuHeads.classList.toggle("look-menu-show");
    menuHeads.classList.toggle("look-menu-hide");
    menuBodies.classList.toggle("look-menu-show");
    menuBodies.classList.toggle("look-menu-hide");
    // Scroll messages to the end
    if (this.comms.status == this.statusValues.messages)
      $("#right-panel-body").scrollTop($("#right-panel-body").prop("scrollHeight"));
    // Restore others
    if (this.comms.status != this.statusValues.messages)
      $("#right-panel-body").scrollTop(this.rememberScroll);
  }

handleKeyInput(event) {
    // console.log(event);
    if(event.which == 13 && event.srcElement.id === 'msgInput') {
      //console.log("user hit enter in comms");
      this.sendMessage();
    }
  }

  sendMessage () {
    this.messages.sendMessage();
  }

}







