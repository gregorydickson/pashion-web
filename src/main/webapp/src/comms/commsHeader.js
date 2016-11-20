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
    http.configure(config => {
      config
        .useStandardConfiguration();
    });
    this.http = http;

    this.comms.status = this.statusValues.messages;
    console.log("Init comms status to " + this.comms.status);
 
  }

  activate(){
    
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

  submit(){
    
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