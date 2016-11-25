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

	contacts = [];
  	user = {};


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

		this.contacts.push ( 
		{
		firstName:"Lauren",
		lastName:"McDonald",
		company:"Ralph Lauren",
		image:"/assets/lauren.png",
		id: 'ID_99'
		});

		this.contacts.push ( 
		{
		firstName:"Shep",
		lastName:"Peterson",
		company:"Ralph Lauren",
		image:"/assets/shep.png",
		id: 'ID_109'
		});


	return Promise.all([
      this.user = this.userService.getUser().then(user => this.user = user)
    ]);



	}

  lookEditContact(id){
    var menu = document.getElementById(id); //$( this ).find( '.lookEditContact' ) // $(".lookEditContact", this); //document.getElementById("lookEditContact"+id);
    menu.classList.toggle("look-menu-show");
  }

  // Create dialog edit contact 

  createDialogEditContact(id) {
    var menu = document.getElementById(id); //document.getElementById("lookEditContact"+itemId);
    menu.classList.toggle("look-menu-show");
    this.dialogService.open({viewModel: CreateDialogEditContact, model: 0 })
      .then(response => {});
  }


  // Create dialog update photo

  CreateDialogUpdatePhoto(id) {
    var menu = document.getElementById(id); //document.getElementById("lookEditContact"+itemId);
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


