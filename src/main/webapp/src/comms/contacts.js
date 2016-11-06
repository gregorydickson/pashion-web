import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import {DialogService} from 'aurelia-dialog';
import 'fetch';

@inject(HttpClient, DialogService)
export class Contacts {

  // Three dots contact edit menu

  lookEditContact(id){
    var menu = document.getElementById("lookEditContact"+id);
    menu.classList.toggle("look-menu-show");
  }

}