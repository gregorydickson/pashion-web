import {HttpClient} from 'aurelia-fetch-client';
import {DialogController} from 'aurelia-dialog';
import {DialogService} from 'aurelia-dialog';
import 'fetch';
import {inject} from 'aurelia-framework';
import {DateFormat} from 'common/dateFormat';
import {CreateDialogEditContact} from './dialogEditContact';
import {CreateDialogUpdatePhoto} from './dialogUpdatePhoto';

@inject(HttpClient, DialogController, DialogService)
export class ContactsList {
	static inject = [DialogController];

	contacts = [];


  constructor(http, controller, dialogService){
	    this.controller = controller;
	    http.configure(config => {
	      config
	        .useStandardConfiguration();
	    });
	    this.http = http;
	    this.dialogService = dialogService;
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

  initiateMessage () {
    
  }


}


