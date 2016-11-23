import {inject} from 'aurelia-framework';
import {UserService} from './services/userService';
import {SampleRequestService} from './services/sampleRequestService';
import {DialogService} from 'aurelia-dialog';
import {CreateDialogNewContact} from './contacts/dialogNewContact';
import {CreateDialogImportContacts} from './contacts/dialogImportContacts';
import {EditSampleRequest} from './sample_request/editSampleRequest';

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
      this.user = this.userService.getUser().then(user => {
        this.user = user;
        if (this.user.type ==="guest") window.location.href = '/user/login';
      });
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

  closeSampleRequestMenu(id){
    var menu = document.getElementById("requestManTest"+id);
    menu.classList.toggle("look-menu-show");
  }

  
  /* RM accordion expansion button */
  closeExpand(buttonNumber) {
    var buttonChoice = document.getElementById("button" + buttonNumber);
    var panelChoice = document.getElementById("panel" + buttonNumber);
    buttonChoice.classList.toggle("active");
    panelChoice.classList.toggle("show");  
  }

  editSampleRequest(itemId) {
    let menu = document.getElementById("requestManTest"+itemId);
    
    menu.classList.toggle("look-menu-show");
    this.dialogService.open({viewModel: EditSampleRequest, model: itemId })
      .then(response => {
        this.reloadBookings();
      });
  }
  reloadBookings(){
    this.bookings = this.sampleRequestService.getSampleRequests().then(bookings => this.bookings = bookings);
  }

  denySampleRequest(id){
    this.closeSampleRequestMenu(id);
    this.sampleRequestService.denySampleRequest(id).then(message =>{
      alert(message.message);
      this.reloadBookings();
    });
  }
  shipSampleRequest(id){
    this.closeSampleRequestMenu(id);
    this.sampleRequestService.shipSampleRequest(id).then(message =>{
      alert(message.message);
      this.reloadBookings();
    });
  }
  sendSampleRequest(id){
    this.closeSampleRequestMenu(id);
    this.sampleRequestService.sendSampleRequest(id).then(message =>{
      alert(message.message);
      this.reloadBookings();
    });
  }
  markPickedUpSampleRequest(id){
    this.closeSampleRequestMenu(id);
    this.sampleRequestService.markPickedUpSampleRequest(id).then(message =>{
      alert(message.message);
      this.reloadBookings();
    });
  }
  markReturnedSampleRequest(id){
    this.closeSampleRequestMenu(id);
    this.sampleRequestService.markReturnedSampleRequest(id).then(message =>{
      alert(message.message);
      this.reloadBookings();
    });
  }
  restockedSampleRequest(id){
    this.closeSampleRequestMenu(id);
    this.sampleRequestService.restockedSampleRequest(id).then(message =>{
      alert(message.message);
      this.reloadBookings();
    });
  }
  deleteSampleRequest(id){
    this.closeSampleRequestMenu(id);
    this.sampleRequestService.deleteSampleRequest(id).then(message =>{
      alert(message.message);
      this.reloadBookings();
    });
  }


  pressMarkReceivedSampleRequest(id){
    this.closeSampleRequestMenu(id);
    this.sampleRequestService.pressMarkReceivedSampleRequest(id).then(message =>{
      alert(message.message);
      this.reloadBookings();
    });
  }
  pressShipSampleRequest(id){
    this.closeSampleRequestMenu(id);
    this.sampleRequestService.pressShipSampleRequest(id).then(message =>{
      alert(message.message);
      this.reloadBookings();
    });
    
  }
  pressMarkPickedUpSampleRequest(id){
    this.closeSampleRequestMenu(id);
    this.sampleRequestService.pressMarkPickedUpSampleRequest(id).then(message =>{
      alert(message.message);
      this.reloadBookings();
    });
  }
  pressDeleteSampleRequest(id){
    this.closeSampleRequestMenu(id);
    this.sampleRequestService.pressDeleteSampleRequest(id).then(message =>{
      alert(message.message);
      this.reloadBookings();
    });
  }
    

    lookEditMenu(id){
    var menu = document.getElementById("requestManTest"+id);
    menu.classList.toggle("look-menu-show");
  }


}