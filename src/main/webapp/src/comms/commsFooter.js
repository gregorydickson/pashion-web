import {DialogController} from 'aurelia-dialog';
import {HttpClient,json} from 'aurelia-fetch-client';
import {DialogService} from 'aurelia-dialog';
import 'fetch';
import {inject} from 'aurelia-framework';
import {DialogRequestContact} from 'contacts/dialogRequestContact';
import {CreateDialogImportContacts} from 'contacts/dialogImportContacts';
import {Messages} from 'messages/messages';


@inject(HttpClient, DialogController, DialogService, Messages)
export class CommsFooter {
  static inject = [DialogController];
  
  constructor(http, controller, dialogService, messages){
    this.dialogService = dialogService;
    this.controller = controller;  
    http.configure(config => {
      config
        .useStandardConfiguration();
    });
    this.http = http;
    this.messages = messages;
 
  }

    // Create dialog edit contact 

  createDialogNewContact(itemId) {
    this.dialogService.open({viewModel: DialogRequestContact, model: itemId, lock:true })
      .then(response => {});
  }


  // Create dialog import contacts 

  CreateDialogImportContacts(itemId) {
    this.dialogService.open({viewModel: CreateDialogImportContacts, model: itemId, lock:true })
      .then(response => {});
  }
/*
  closeExpand(buttonNumber) {
    var buttonChoice = document.getElementById("button" + buttonNumber);
    var panelChoice = document.getElementById("panel" + buttonNumber);
    buttonChoice.classList.toggle("active");
    panelChoice.classList.toggle("show");  
  }
*/
    sendMessage () {
    this.messages.sendMessage();
  }

}







