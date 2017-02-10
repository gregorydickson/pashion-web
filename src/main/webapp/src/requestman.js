import {inject,bindable, bindingMode } from 'aurelia-framework';
import {UserService} from './services/userService';
import {SampleRequestService} from './services/sampleRequestService';
import {DialogService} from 'aurelia-dialog';
import {CreateDialogNewContact} from './contacts/dialogNewContact';
import {CreateDialogImportContacts} from './contacts/dialogImportContacts';
import {EditSampleRequest} from './sample_request/editSampleRequest';
import {busy} from './services/busy';

@inject(DialogService, UserService, SampleRequestService,busy)
export class Requestman{
	  
  @bindable({defaultBindingMode: bindingMode.twoWay}) bookings = [];
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
  filtering = 'ALL';



  constructor(dialogService,userService,sampleRequestService,busy) {
    
    this.dialogService = dialogService;
    this.userService = userService;
    this.sampleRequestService = sampleRequestService;
    this.busy = busy;

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

        // intercept search to clear the image on the left
        var parent = this;
        $('#search-requests').on('keydown', function() {
            // console.log("x hit/search in search requests");
            //if (parent.closed) return;
            var buttonChoice = document.getElementById("button" + parent.opened);
            var panelChoice = document.getElementById("panel" + parent.opened);
            if (buttonChoice != null) {
                  parent.closed = true; 
                  buttonChoice.classList.toggle("active");}
            if (panelChoice != null) {
                  parent.closed = true;
                  panelChoice.classList.toggle("show");}
            parent.brand = '';
            parent.image = '';
            parent.season =  '';
            parent.look = '';
            parent.opened = ''; 
        });
  }

    orderChange(event) {
        console.log("Order changed: ");
        this.closeExpanded ();
        if (event)
            if (event.detail)
                if (event.detail.value) {
                    if (event.detail.value == 'BY DATE') this.ordering = 'bookingStartDate';
                    if (event.detail.value == 'BY NUMBER`') this.ordering = 'id'; 
                    if (event.detail.value == 'BY STATUS') this.ordering = 'requestStatusBrand';
                    console.log("value:" + event.detail.value + "ordering: " +this.ordering);
                }          
    }


  filterChange(event){
      console.log("changing filter: ");
      this.closeExpanded ();
          if (event)
            if (event.detail)
                if (event.detail.value) {
                    if (event.detail.value == 'ALL') this.filtering = '';
                    if (event.detail.value == 'MY REQUESTS') this.filtering = 'MY REQUESTS'; 
                    if (event.detail.value == 'OVERDUE REQUESTS') this.filtering = 'OVERDUE REQUESTS';  
                    if (event.detail.value == 'OPEN REQUESTS') this.filtering = 'OPEN REQUESTS'; 
                    //console.log("value:" + event.detail.value + " filtering: " +this.filtering);
                } 
  }


  filterFunc(searchExpression, value, filter, user){
    // editorialName, pressHouse

    var searchVal = true;
    var filterVal = true;
    //this.closeExpanded ();

    if (searchExpression == '' && filter == '') return true;
    var itemValue ='';
    if (value.pressHouse) itemValue = value.pressHouse.name;
    if (value.brand)  itemValue = itemValue + value.brand.name;
    if (value.prAgency) itemValue = itemValue + value.prAgency.name;
    if ((value.deliverTo) && value.deliverTo.pressHouse) itemValue = value.deliverTo.pressHouse.name;
    if ((value.deliverTo) && value.deliverTo.brand)  itemValue = itemValue + value.deliverTo.brand.name;
    if ((value.deliverTo) && value.deliverTo.prAgency) itemValue = itemValue + value.deliverTo.prAgency.name;
    if (value.editorialName) itemValue = itemValue + value.editorialName;
    if (value.editorialWho) itemValue = itemValue + value.editorialWho;
    if (value.requestingUser) itemValue = itemValue + value.requestingUser.surname + value.requestingUser.name;
    if (value.returnToName) itemValue = itemValue + value.returnToName;
    if (value.returnToSurname) itemValue = itemValue + value.returnToSurname;
    if (value.addressDestination) itemValue = itemValue + value.addressDestination.name;

    //console.log("Search value: " + itemValue);
    if(searchExpression && itemValue) searchVal = itemValue.toUpperCase().indexOf(searchExpression.toUpperCase()) !== -1;   

    if (filter == 'MY REQUESTS') {
      filterVal = (value.requestingUser.id == user.id);
    }
    if (filter == 'OVERDUE REQUESTS') {
      filterVal = (value.requestStatusBrand == 'Overdue');
    }
    if (filter == 'OPEN REQUESTS') {
      filterVal = (value.requestStatusBrand != 'Closed');
    }
    //console.log(" filterfunc return value: " +  searchVal + " " + filterVal + " :: " + (searchVal && filterVal));
    return (searchVal && filterVal); 
  }

  closeExpanded () {
    if (this.closed) return;
    var buttonChoice = document.getElementById("button" + this.opened);
    var panelChoice = document.getElementById("panel" + this.opened);
    buttonChoice.classList.toggle("active");
    panelChoice.classList.toggle("show");
    this.brand = '';
    this.image = '';
    this.season =  '';
    this.look = '';
    this.closed = true;
    this.opened = ''; 
  }

  closeSampleRequestMenu() {}

  
  /* RM accordion expansion button */
  closeExpand(buttonNumber, sampleRequest) {
    console.log("Close Expand");
      var buttonChoice = document.getElementById("button" + buttonNumber);
      var panelChoice = document.getElementById("panel" + buttonNumber);
      buttonChoice.classList.toggle("active");
      panelChoice.classList.toggle("show");
    if(this.closed && sampleRequest){
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
    this.sampleRequestService.getSampleRequests().then(bookings => {
      this.bookings = bookings;
      this.busy.off();
    });
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

  delete(id){
    console.log("delete hack");
    var someNewArray = [];
    this.bookings;
    
    for (var i = 0, length = this.bookings.length; i < length; i++) {
      var abooking = this.bookings.pop();
      someNewArray.push(abooking);
    }
    for (var i = 0, len = someNewArray.length; i < len; i++) {
        var transfer = someNewArray.pop();
        if(transfer.id != id){
          this.bookings.push(transfer);
        }
    }
    
  }

  deleteSampleRequest(index,id){
    this.image = '';
    if(this.open)
      this.closeExpand(index,null);
    console.log ("push/pop hacking delete");
    this.delete(id);
    
    this.sampleRequestService.deleteSampleRequest(id).then(message =>{
      this.reloadBookings();
    });
    this.closeExpanded();
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