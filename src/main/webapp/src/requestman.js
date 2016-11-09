import {inject} from 'aurelia-framework';
import {UserService} from './services/userService';
import {SampleRequestService} from './services/sampleRequestService';
import {DialogService} from 'aurelia-dialog';
import {CreateDialogNewContact} from './contacts/dialogNewContact';

@inject(DialogService, UserService, SampleRequestService)
export class Requestman{
	  
  bookings = [];
  searchTest = "";
  status = [];
  selectedStatus = "";
  user = {};



  constructor(dialogService,userService,sampleRequestService) {
    
    this.dialogService = dialogService;
    this.userService = userService;
    this.sampleRequestService = sampleRequestService;

  }

	activate() {
      this.user = this.userService.getUser().then(user => this.user = user);
      return this.bookings = this.sampleRequestService.getSampleRequests()
        .then(bookings => {
          this.bookings = bookings;
          console.log("bookings:");
          console.log(bookings.length);
        });
  }


	filterChange(event){
	    console.log("changing");
	}

  
  /* RM accordion expansion button */
  closeExpand(buttonNumber) {
    var buttonChoice = document.getElementById("button" + buttonNumber);
    var panelChoice = document.getElementById("panel" + buttonNumber);
    buttonChoice.classList.toggle("active");
    panelChoice.classList.toggle("show");  
  }
    
  // Create dialog edit contact 

  createDialogNewContact(itemId) {
    this.dialogService.open({viewModel: CreateDialogNewContact, model: itemId })
      .then(response => {});
  }

    lookEditMenu(id){
    var menu = document.getElementById("requestManTest"+id);
    menu.classList.toggle("look-menu-show");
  }


}