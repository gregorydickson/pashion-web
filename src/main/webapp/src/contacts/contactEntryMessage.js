import {HttpClient} from 'aurelia-fetch-client';
import {DialogController} from 'aurelia-dialog';
import {DialogService} from 'aurelia-dialog';
import 'fetch';
import {BindingEngine,inject} from 'aurelia-framework';
import {DateFormat} from 'common/dateFormat';
import {CreateDialogEditContact} from './dialogEditContact';
import {CreateDialogUpdatePhoto} from './dialogUpdatePhoto';
import {Messages} from 'messages/messages';
import {UserService} from 'services/userService';
import {EventAggregator} from 'aurelia-event-aggregator';


@inject(HttpClient, DialogController, DialogService, UserService,EventAggregator)
export class ContactEntryMessage {
  static inject = [DialogController];

  currentContact = {};


  

  constructor(http, controller, dialogService, userService,eventAggregator){
    this.controller = controller;
    http.configure(config => {
      config
        .useStandardConfiguration();
    });
    this.http = http;
    this.dialogService = dialogService;
    //this.messages = messages;
    this.userService = userService;
    
    this.ea = eventAggregator;

  }

  activate () {

  }

  attached () {
    //this.userService.getUserdetails (headerContactId);
    // console.log ("Contact details: " + headerContactDetails);
    let contact = this.currentContact
    this.subscriber = this.ea.subscribe('setCurrentContact', response => {
            
            this.userService.getUserDetails(response.userId).then(contact => {
              this.currentContact = contact;
            });
            
    });
  }

  subChange(newvalue,oldvalue){
    console.log("Change New value: Old value:"+oldvalue.name);  
    
  }
  
  setCurrentContact (id) {
    this.userService.getUserDetails(id).then(currentContact => {
      this.currentContact.name = currentContact.name;
      this.currentContact.surname = currentContact.surname;
      this.currentContact.brand = currentContact.brand;
      this.currentContact.email = currentContact.email;
      this.currentContact.id = currentContact.id;

      console.log("New set contact:"+this.name);
    });
  }

}