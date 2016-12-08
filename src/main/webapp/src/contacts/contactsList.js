import {HttpClient} from 'aurelia-fetch-client';
import {DialogController} from 'aurelia-dialog';
import {DialogService} from 'aurelia-dialog';
import 'fetch';
import {inject} from 'aurelia-framework';
import {DateFormat} from 'common/dateFormat';
import {CreateDialogEditContact} from './dialogEditContact';
import {CreateDialogUpdatePhoto} from './dialogUpdatePhoto';
import {UserService} from 'services/userService';import {CommsHeader} from 'comms/commsHeader';
import {EventAggregator} from 'aurelia-event-aggregator';
import {Messages} from 'messages/messages';


@inject(HttpClient, DialogController, DialogService, UserService, CommsHeader,EventAggregator, Messages)
export class ContactsList {
	static inject = [DialogController];

  user = {};
  users = [];
  searchTerm = ''; // hard wired search goes here
  contactActivity = "19";
  connectString ="connect";
  //connections = [];

  constructor(http, controller, dialogService, userService, commsHeader, eventAggregator, messages){
	    this.controller = controller;
	    http.configure(config => {
	      config
	        .useStandardConfiguration();
	    });
	    this.http = http;
	    this.dialogService = dialogService;
    	this.userService = userService;
    	this.commsHeader = commsHeader;
      this.ea = eventAggregator;
      this.messages = messages;
      
	}

	activate () {

  var forceGetFromServer = false;
	return Promise.all([
      this.user = this.userService.getUser().then(user => this.user = user),
      //this.connections = this.userService.getConnections().then(connections => this.connections = connections),
      this.users = this.userService.getUsers(forceGetFromServer).then(users => this.users = users)
    ]);
	}

//RM test button
fetchGetUserFromServer () {
  this.userService.getUsers(true).then(users => this.users = users);
}

// contact workflow
  contactMenu(id){
    var menu = document.getElementById('connect'+id); 
    menu.classList.toggle("look-menu-show");
     }

  acceptContact(user,id) {
    var menu = document.getElementById('connect'+id); 
    // menu.classList.toggle("look-menu-show"); // RM not necessary?
    this.userService.acceptContact(user,id)
      .then(response => {
      });
  }

  declineContact(user,id) {
    var menu = document.getElementById('connect'+id); 
    // menu.classList.toggle("look-menu-show"); // RM not necessary, not sure why
    this.userService.denyContact(user,id)
      .then(response => {
      });
  }

  deleteContact(user,id) {
    this.userService.deleteContact(user,id)
      .then(response => {
      });
  }


// contact lists
  lookEditContact(id){
    var menu = document.getElementById(id); 
    menu.classList.toggle("look-menu-show");
  }

  closeExpand(buttonNumber) {
    var buttonChoice = document.getElementById("button" + buttonNumber);
    var panelChoice = document.getElementById("panel" + buttonNumber);
    buttonChoice.classList.toggle("active");
    panelChoice.classList.toggle("show"); 
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
    // console.log("contactlist setting current contact: " + id);
    // clear unread messages
    this.userService.clearUnreadMessages (id); // still done locally change to .then if add server
    this.ea.publish('setCurrentContact', {userId: id});
  	this.commsHeader.setStatusTab(this.commsHeader.statusValues.messages);
      
  }

    filterFunc(searchExpression, value){
     
     let itemValue = value.name + value.surname;
     if (value.brand != null) itemValue += value.brand.name; 
     if (value.presshouse !=null) itemValue += value.pressHouse.name;
     if(!searchExpression || !itemValue) return false;
     
     return itemValue.toUpperCase().indexOf(searchExpression.toUpperCase()) !== -1;
     
  }


}


