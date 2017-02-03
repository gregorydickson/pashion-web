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

  look = '';
  brand = '';
  samples = [];
  image = '';
  season = '';
  closed = true;
  searchTextReqMan = '';
  ordering ='bookingStartDate';
  filtering = 'Open Requests';



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

  attached() {
    // Three dots Menu dropdown close when click outside
        $('body').click(function() {
            $(".look-menu-absolute").each(function() {
                $(this).removeClass("look-menu-show");
            });
        });
  }

    orderChange(event) {
        console.log("Order changed: ");
        if (event)
            if (event.detail)
                if (event.detail.value) {
                    if (event.detail.value == 'By Due Out Date') this.ordering = 'bookingStartDate';
                    if (event.detail.value == 'By Number') this.ordering = 'id'; 
                    if (event.detail.value == 'By Status') this.ordering = 'requestStatusBrand';
                    console.log("value:" + event.detail.value + "ordering: " +this.ordering);
                }          
    }


  filterChange(event){
      console.log("changing filter: ");
          if (event)
            if (event.detail)
                if (event.detail.value) {
                    if (event.detail.value == 'All') this.filtering = '';
                    if (event.detail.value == 'My Requests') this.filtering = 'My Requests'; 
                    if (event.detail.value == 'Overdue Requests') this.filtering = 'Overdue Requests';  
                    if (event.detail.value == 'Open Requests') this.filtering = 'Open Requests'; 
                    console.log("value:" + event.detail.value + " filtering: " +this.filtering);
                } 
  }


  filterFunc(searchExpression, value, filter, user){
    // editorialName, pressHouse

    var searchVal = true;
    var filterVal = true;

    if (searchExpression == '' && filter == '') return true;
    var itemValue ='';
    if (value.pressHouse) itemValue = value.pressHouse.name;
    if (value.brand)  itemValue = itemValue + value.brand.name;
    if (value.prAgency) itemValue = itemValue + value.prAgency.name;
    if (value.deliverTo.pressHouse) itemValue = value.deliverTo.pressHouse.name;
    if (value.deliverTo.brand)  itemValue = itemValue + value.deliverTo.brand.name;
    if (value.deliverTo.prAgency) itemValue = itemValue + value.deliverTo.prAgency.name;
    if (value.editorialName) itemValue = itemValue + value.editorialName;
    if (value.editorialWho) itemValue = itemValue + value.editorialWho;
    if (value.requestingUser) itemValue = itemValue + value.requestingUser.surname + value.requestingUser.name;
    if (value.returnToName) itemValue = itemValue + value.returnToName;
    if (value.returnToSurname) itemValue = itemValue + value.returnToSurname;
    if (value.addressDestination) itemValue = itemValue + value.addressDestination.name;

    //console.log("Filter value: " + itemValue);
    if(searchExpression && itemValue) searchVal = itemValue.toUpperCase().indexOf(searchExpression.toUpperCase()) !== -1;   

    if (filter == 'My Requests') {
      filterVal = (value.requestingUser.id == user.id);
    }
    if (filter == 'Overdue Requests') {
      filterVal = (value.requestStatusBrand == 'Overdue');
    }
    if (filter == 'Open Requests') {
      filterVal = (value.requestStatusBrand != 'Closed');
    }

    return (searchVal && filterVal); 
  }


  closeSampleRequestMenu(id){
    //var menu = document.getElementById("requestManTest"+id);
    //menu.classList.toggle("look-menu-show");
  }

  
  /* RM accordion expansion button */
  closeExpand(buttonNumber, sampleRequest) {
    console.log("Close Expand");
      var buttonChoice = document.getElementById("button" + buttonNumber);
      var panelChoice = document.getElementById("panel" + buttonNumber);
      buttonChoice.classList.toggle("active");
      panelChoice.classList.toggle("show");
    if(this.closed){
      this.brand = sampleRequest.brand.name;
      this.image = sampleRequest.image;
      this.season = sampleRequest.season;
      this.look = sampleRequest.look;
      this.closed = false;
      this.opened = buttonNumber; 
    }
    else { 
      if(this.opened != buttonNumber) {
        var buttonChoiceC = document.getElementById("button" + this.opened);
        var panelChoiceC = document.getElementById("panel" + this.opened);
        buttonChoiceC.classList.toggle("active");
        panelChoiceC.classList.toggle("show");
        this.brand = sampleRequest.brand.name;
        this.image = sampleRequest.image;
        this.season = sampleRequest.season;
        this.look = sampleRequest.look;
        this.closed = false;
        this.opened = buttonNumber
      }
      else {
        this.brand = '';
        this.image = '';
        this.season =  '';
        this.look = '';
        this.closed = true;
        this.opened = ''; 
      }
     }
  }

  editSampleRequest(itemId) {
    //let menu = document.getElementById("requestManTest"+itemId);
    
    this.closeSampleRequestMenu(itemId);
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
  approveSampleRequest(id){
    this.closeSampleRequestMenu(id);
    this.sampleRequestService.approveSampleRequest(id).then(message =>{
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