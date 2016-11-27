import {HttpClient} from 'aurelia-fetch-client';
import {DialogController} from 'aurelia-dialog';
import {DialogService} from 'aurelia-dialog';
import 'fetch';
import {inject} from 'aurelia-framework';
import {DateFormat} from 'common/dateFormat';
import {CreateDialogEditContact} from './dialogEditContact';
import {CreateDialogUpdatePhoto} from './dialogUpdatePhoto';
import {UserService} from 'services/userService';
import {Messages} from 'messages/messages';
import {CommsHeader} from 'comms/commsHeader';

@inject(HttpClient, DialogController, DialogService, UserService, Messages, CommsHeader)
export class ContactsList {
	static inject = [DialogController];

  user = {};
  users = [];

  constructor(http, controller, dialogService, userService, messages, commsHeader){
	    this.controller = controller;
	    http.configure(config => {
	      config
	        .useStandardConfiguration();
	    });
	    this.http = http;
	    this.dialogService = dialogService;
    	this.userService = userService;
    	this.messages = messages;
    	this.commsHeader = commsHeader;
	}

	activate () {

	return Promise.all([
      this.user = this.userService.getUser().then(user => this.user = user),
      this.users = this.userService.getUsers("",status).then(users => this.users = users)
    ]);
	}

  lookEditContact(id){
    var menu = document.getElementById(id); 
    menu.classList.toggle("look-menu-show");
  }

  // Create dialog edit contact 

  createDialogEditContact(id) {
    var menu = document.getElementById(id); 
    menu.classList.toggle("look-menu-show");
    this.dialogService.open({viewModel: CreateDialogEditContact, model: 0 })
      .then(response => {});
  }


  // Create dialog update photo
  CreateDialogUpdatePhoto(id) {
    var menu = document.getElementById(id); 
    menu.classList.toggle("look-menu-show");
    this.dialogService.open({viewModel: CreateDialogUpdatePhoto, model: 0 })
      .then(response => {});
  }

  initiateMessage (id) {
  	this.messages.setCurrentContact (id);
  	console.log("currentContact send: " + id);
  	this.commsHeader.setStatusTab(this.commsHeader.statusValues.messages);
    
  }


}


