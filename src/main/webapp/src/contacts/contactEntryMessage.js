import {inject} from 'aurelia-framework';
import {UserService} from 'services/userService';

@inject(UserService)
export class ContactEntryMessage {

  currentContact = {};

  constructor(userService){
    this.userService = userService;
  }

  activate () {
    this.currentContact.name = 'This is a long Test name';
  }

  attached () {
  }

  setCurrentContact (id) {
    this.currentContact = this.userService.getUserDetails(id).then(currentContact => this.currentContact = currentContact);
  }

}