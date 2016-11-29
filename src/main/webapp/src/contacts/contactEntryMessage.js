import {HttpClient} from 'aurelia-fetch-client';
import {DialogController} from 'aurelia-dialog';
import {DialogService} from 'aurelia-dialog';
import 'fetch';
import {inject} from 'aurelia-framework';
import {DateFormat} from 'common/dateFormat';
import {CreateDialogEditContact} from './dialogEditContact';
import {CreateDialogUpdatePhoto} from './dialogUpdatePhoto';
import {Messages} from 'messages/messages';
import {UserService} from 'services/userService';

@inject(HttpClient, DialogController, DialogService, UserService)
export class ContactEntryMessage {
	static inject = [DialogController];

  currentContact = {};

  constructor(http, controller, dialogService, userService){
    this.controller = controller;
    http.configure(config => {
      config
        .useStandardConfiguration();
    });
    this.http = http;
    this.dialogService = dialogService;
    //this.messages = messages;
    this.userService = userService;

  }

  activate () {

  }

  attached () {
    //this.userService.getUserdetails (headerContactId);
    // console.log ("Contact details: " + headerContactDetails);
  }

  setCurrentContact (id) {
    this.userService.getUserDetails (id).then(currentContact => this.currentContact = currentContact);
  }

}