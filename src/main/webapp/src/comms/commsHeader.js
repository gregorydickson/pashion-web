import {DialogController} from 'aurelia-dialog';
import {HttpClient,json} from 'aurelia-fetch-client';
import {DialogService} from 'aurelia-dialog';
import 'fetch';
import {inject} from 'aurelia-framework';
import {singleton} from 'aurelia-framework';
import {CreateDialogNewContact} from 'contacts/dialogNewContact';
import {CreateDialogImportContacts} from 'contacts/dialogImportContacts';
import {Messages} from 'messages/messages';
import {EventAggregator} from 'aurelia-event-aggregator';


@inject(HttpClient, DialogController, DialogService, Messages, EventAggregator)
@singleton()
export class CommsHeader {
  static inject = [DialogController];

 statusValues = {messages : "messages", contacts: "contacts", news : "news"};
  comms = {};
  currentContact = null;
  contactActivity = true;
  
  constructor(http, controller, dialogService, messages, eventAggregator){
    this.dialogService = dialogService;
    this.controller = controller;  
    
    http.configure(config => {
      config
        .useStandardConfiguration();
    });
    this.http = http;
    this.messages = messages;

    this.comms.status = this.statusValues.contacts;
    console.log("Init comms status to " + this.comms.status);
    this.ea = eventAggregator;

    var parent = this;
    this.subscriber = this.ea.subscribe('setCurrentContact', response => { 
      this.currentContact = response.userId;             
    });
 
  }

  activate(){
  }

  attached () {
   $("#right-panel-body").scrollTop($("#right-panel-body").prop("scrollHeight"));
  }

  detached() {
  }


  setStatusTab (id) {
    // prevent switch to messages if there is no currentContact
    if (this.currentContact != null){ // id == this.statusValues.messages && 
      // remember scroll position for not messages
      if (this.comms.status != this.statusValues.messages)
        this.rememberScroll = $("#right-panel-body").scrollTop();
      //switch the HTML
      var menuHeads = document.getElementById("tab-"+ this.comms.status);  
      var menuBodies = document.getElementById("tab-"+ this.comms.status + "-body");
      var menuFooters = document.getElementById("tab-"+ this.comms.status + "-footer");
      menuHeads.classList.toggle("look-menu-hide");
      menuHeads.classList.toggle("look-menu-show");
      menuBodies.classList.toggle("look-menu-hide");
      menuBodies.classList.toggle("look-menu-show");
      menuFooters.classList.toggle("look-menu-hide");
      menuFooters.classList.toggle("look-menu-show");
    	this.comms.status = id;
      menuHeads = document.getElementById("tab-"+id);
      menuBodies = document.getElementById("tab-"+id+ "-body");
      menuFooters = document.getElementById("tab-"+id+ "-footer");
      menuHeads.classList.toggle("look-menu-show");
      menuHeads.classList.toggle("look-menu-hide");
      menuBodies.classList.toggle("look-menu-show");
      menuBodies.classList.toggle("look-menu-hide");
      menuFooters.classList.toggle("look-menu-show");
      menuFooters.classList.toggle("look-menu-hide");
      // Restore others
      if (this.comms.status != this.statusValues.messages)
         $("#right-panel-body").scrollTop(this.rememberScroll);
      // Scroll messages to the end
      if (this.comms.status == this.statusValues.messages)
        window.setTimeout(function () {
            // $("#messages-inside-top").height($("#messages-inside-top").height()+500); // RM kludge to redraw flex box with new elements
            $("#messages-inside-top").scrollTop($("#messages-inside-top").prop("scrollHeight"));
            $("#right-panel-body").scrollTop($("#right-panel-body").prop("scrollHeight"));
          },1500); // major kludge to scroll messages

    }
  }

 /* sendMessage () {
    this.messages.sendMessage();
  } */

}







