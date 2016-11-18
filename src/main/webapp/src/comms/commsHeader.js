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

    this.comms.status = this.statusValues.contacts;
    console.log("Init comms status to " + this.comms.status);

    // this.myTabs = [
   //   { id: 'tab1', label: 'Tab 1', selected: true },
   //   { id: 'tab2', label: 'Tab 2' },
   //   { id: 'tab3', label: 'Tab 3' }
   // ];
   // this.myModel = { target: 'World' };
  }

  activate(){
    
  }

  setStatusToMessages () {
  	this.comms.status = this.statusValues.messages;
    console.log("Setting comms status to message");
  }

   setStatusToContacts () {
  	this.comms.status = this.statusValues.contacts;
    console.log("Setting comms status to contacts");
  }

  submit(){
    
  }
}