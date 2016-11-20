import {DialogController} from 'aurelia-dialog';
import {HttpClient,json} from 'aurelia-fetch-client';
import 'fetch';
import {inject} from 'aurelia-framework';


@inject(HttpClient, DialogController)
export class CommsHeader {
  static inject = [DialogController];
  
  statusValues = {messages : "messages", contacts: "contacts", news : "news"};
  comms = {};
  
  constructor(http, controller){
    this.controller = controller;
    
    http.configure(config => {
      config
        .useStandardConfiguration();
    });
    this.http = http;

    this.comms.status = this.statusValues.messages;
    console.log("Init comms status to " + this.comms.status);

//this.myTabs = [
  //    { id: 'tab1', label: 'Contacts', active: true },
    //  { id: 'tab2', label: 'Messages' },
      //{ id: 'tab3', label: 'News' }
    //];
 
  }

  activate(){
    
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

}