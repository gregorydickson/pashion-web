import {DialogController} from 'aurelia-dialog';
import {HttpClient,json} from 'aurelia-fetch-client';
import {DialogService} from 'aurelia-dialog';
import 'fetch';
import {inject} from 'aurelia-framework';
import {CreateDialogNewContact} from 'contacts/dialogNewContact';
import {CreateDialogImportContacts} from 'contacts/dialogImportContacts';
import {Messages} from 'messages/messages';


@inject(HttpClient, DialogController, DialogService, Messages)
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

    this.comms.status = this.statusValues.messages;
    console.log("Init comms status to " + this.comms.status);
 
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
      this.messages.sendMessage();
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


}







