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


@inject(HttpClient, DialogController, DialogService, UserService, CommsHeader,EventAggregator)
export class ContactsList {
	static inject = [DialogController];

  user = {};
  users = [];
  searchTerm = ''; // hard wired search goes here
  contactActivity = "19";
  connectString ="connect";
  //connections = [];

  constructor(http, controller, dialogService, userService, commsHeader, eventAggregator){
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
      
	}

	activate () {

	return Promise.all([
      this.user = this.userService.getUser().then(user => this.user = user),
      //this.connections = this.userService.getConnections().then(connections => this.connections = connections),
      this.users = this.userService.getUsers("",status).then(users => this.users = users)
    ]);
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
        //this.connections = this.userService.getConnections().then(connections => this.connections = connections);
        this.users = this.userService.getUsers("",status).then(users => this.users = users);
      });
      //$("#panel11").animate({scrollTop: $("#panel11").prop("scrollHeight")}, 50);
      //$("#panel12").animate({scrollTop: $("#panel12").prop("scrollHeight")}, 50);
  }

  declineContact(user,id) {
    var menu = document.getElementById('connect'+id); 
    // menu.classList.toggle("look-menu-show"); // RM not necessary?
    this.userService.denyContact(user,id)
      .then(response => {
        //this.connections = this.userService.getConnections().then(connections => this.connections = connections);
        this.users = this.userService.getUsers("",status).then(users => this.users = users);
      });
      //$("#panel11").animate({scrollTop: $("#panel11").prop("scrollHeight")}, 50);
      //$("#panel12").animate({scrollTop: $("#panel12").prop("scrollHeight")}, 50);
  }

    deleteContact(user,id) {
    //var menu = document.getElementById('connect'+id); 
    // menu.classList.toggle("look-menu-show"); // RM not necessary?
    this.userService.deleteContact(user,id)
      .then(response => {
        //this.connections = this.userService.getConnections().then(connections => this.connections = connections);
        this.users = this.userService.getUsers("",status).then(users => this.users = users);
      });
      //$("#panel11").animate({scrollTop: $("#panel11").prop("scrollHeight")}, 50);
      //$("#panel12").animate({scrollTop: $("#panel12").prop("scrollHeight")}, 50);
      //this.redraw(document.getElementById("right-panel-body"));
      //this.redraw(document.getElementById("panel11"));
      //this.redraw(document.getElementById("panel12"));
  }


// contact lists
  lookEditContact(id){
    var menu = document.getElementById(id); 
    menu.classList.toggle("look-menu-show");
    //$("#right-panel-body").height($("#right-panel-body").height()+160); // kludge to grow container to get menu, should worklike request list in index, seems to trigger a re-calc
  }

  closeExpand(buttonNumber) {
    var buttonChoice = document.getElementById("button" + buttonNumber);
    var panelChoice = document.getElementById("panel" + buttonNumber);
    buttonChoice.classList.toggle("active");
    panelChoice.classList.toggle("show"); 
    this.users = this.userService.getUsers("",status).then(users => this.users = users); 
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
    this.ea.publish('setCurrentContact', {userId: id});
  	this.commsHeader.setStatusTab(this.commsHeader.statusValues.messages);
    // dirty updates
    //$("#right-panel-body").animate({scrollTop: $("#right-panel-body").prop("scrollHeight")}, 500);
    //this.connections = this.userService.getConnections().then(connections => this.connections = connections);
    //this.users = this.userService.getUsers("",status).then(users => this.users = users);
      
  }

    filterFunc(searchExpression, value){
     
     let itemValue = value.name + value.surname;
     if (value.brand != null) itemValue += value.brand.name; 
     if (value.presshouse !=null) itemValue += value.pressHouse.name;
     if(!searchExpression || !itemValue) return false;
     
     return itemValue.toUpperCase().indexOf(searchExpression.toUpperCase()) !== -1;
     
  }
  /* redraw(element){
    element.style.display='none';
    element.offsetHeight; 
    element.style.display='';
    element.animate({scrollTop: element.scrollHeight}, 50)
  } */


}


