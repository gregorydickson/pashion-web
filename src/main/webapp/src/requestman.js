import {inject,bindable, bindingMode } from 'aurelia-framework';
import {UserService} from './services/userService';
import {SampleRequestService} from './services/sampleRequestService';
import { PubNubService } from './services/pubNubService';
import {DialogService} from 'aurelia-dialog';
import {CreateDialogNewContact} from './contacts/dialogNewContact';
import {CreateDialogImportContacts} from './contacts/dialogImportContacts';
import {EditSampleRequest} from './sample_request/editSampleRequest';
import {busy} from './services/busy';
import { CreateDialogAlert } from './common/dialogAlert';
import { HttpClient } from 'aurelia-fetch-client';
import { EventAggregator } from 'aurelia-event-aggregator';
import {PDFService} from './services/PDFService';

@inject(HttpClient, DialogService, UserService, PDFService, SampleRequestService,busy, EventAggregator, PubNubService)
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
  filtering = ''; // IE all



  constructor(http,dialogService,userService,pDFService, sampleRequestService,busy,eventAggregator,pubNubService) {
    http.configure(config => {
            config
                .useStandardConfiguration();
        });

    this.http = http;  
    this.dialogService = dialogService;
    this.userService = userService;
    this.sampleRequestService = sampleRequestService;
    this.busy = busy;
    this.ea = eventAggregator;
    this.pDFService = pDFService;
    this.pubNubService = pubNubService;

  }

	activate() {
      this.http.fetch('/dashboard/seasons').then(response => response.json()).then(seasons => this.seasons = seasons);
      this.user = this.userService.getUser().then(user => {
        this.user = user;
        // if (this.user.type ==="guest") window.location.href = '/user/login';
      });
      return this.bookings = this.sampleRequestService.getSampleRequests()
        .then(bookings => {
          this.bookings = bookings;
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

        this.subscriber = this.ea.subscribe('datepicker', response => {
            //console.log("datepicker event: " + response.elementId + " : " + response.elementValue);
            this.closeExpanded ();
            var fireChange = false;
            if (response.elementId === 'datepickersearchto') {
                  this.searchTo = response.elementValue;
                  if ((this.searchFrom) && (new Date(this.searchFrom).getTime() <= new Date(this.searchTo).getTime()))
                  {
                      this.fireChange = true;
                  }
                  else {
                    document.getElementById('datepickersearchto').value = '';
                    this.searchTo = '';
                  }
                }
            if (response.elementId === 'datepickersearchfrom') {
                 this.searchFrom = response.elementValue;
                 this.fireChange = true;
                 //  clear the to field as well
                 this.searchTo = '';
                 document.getElementById('datepickersearchto').value = ''
               }

            if (this.fireChange) this.filterChange();
            /*if ((this.availableTo && this.availableFrom) || (this.availableFrom))
                this.filterChangeDates(); */

        });

        this.listenForBookingsCacheInvalidation(this.pubNubService.getPubNub())
  }

/*    orderChange(event) {
        console.log("Order changed: ");
        this.closeExpanded ();
        if (event)
            if (event.detail)
                if (event.detail.value) {
                    if (event.detail.value == 'BY DATE') this.ordering = 'bookingStartDate';
                    if (event.detail.value == 'BY NUMBER') this.ordering = 'id'; 
                    if (event.detail.value == 'BY STATUS') this.ordering = 'requestStatusBrand';
                    console.log("value:" + event.detail.value + "ordering: " +this.ordering);
                }          
    } */

    createPDFDialog() {
      //container = document.getElementsByClassName ('brandGridContent');
      var dates ='';
      var filter = '';
      if (this.filtering) filter = "Filter: " + this.filtering;
      var search = '';
      if (this.searchTextReqMan) search = "Search: '" + this.searchTextReqMan +"'";
      if (this.searchFrom) dates = "From: " + this.searchFrom;
      if (this.searchTo) dates = dates + " to " + this.searchTo;
      // var headerText = {};
      if (this.user.type == 'brand' || this.user.type == 'prAgency') var headerText = ['ID','LOOK','DUE DATE','COMPANY','EDITORIAL','WHO','#','STATUS'];
      if (this.user.type == 'press') var headerText = ['ID','LOOK','REQUESTED','BRAND','EDITORIAL','OWNER','#','STATUS'];
      this.pDFService.generatePDF(this.user.name, this.user.surname, dates, search, filter, headerText );
      //console.log("container to text: " + container);
    }


      orderChange(event) {
        console.log("Order changed ");
        this.closeExpanded ();
        if (event)
            if (event.detail)
                if (event.detail.value) {
                    if (event.detail.value == 'BY DATE') this.ordering = 'bookingStartDate';
                    if ((this.user.type == "brand") && (event.detail.value == 'BY NUMBER')) this.ordering = 'id'; //RM ditto below
                    if ((this.user.type == "prAgency") && (event.detail.value == 'BY NUMBER')) this.ordering = 'id'; //RM ditto below
                    if ((this.user.type == "press") && (event.detail.value == 'BY NUMBER')) this.ordering = 'id'; //RM changes needed here to properly order strings
                    if ((this.user.type == "brand") && (event.detail.value == 'BY STATUS')) this.ordering = 'requestStatusBrand'; 
                    if ((this.user.type == "prAgency") && (event.detail.value == 'BY STATUS')) this.ordering = 'requestStatusBrand'; //RM double check this
                    if ((this.user.type == "press") && (event.detail.value == 'BY STATUS')) this.ordering = 'requestStatusPress';
                    console.log("value:" + event.detail.value + "ordering: " +this.ordering);
                }          
    }


  filterChange(event){
      console.log("changing filterChange (dates: " + this.searchFrom + " to " + this.searchTo);
      this.closeExpanded ();
          if (event)
            if (event.detail)
                if (event.detail.value) {
                    if (event.detail.value == 'ALL REQUESTS') this.filtering = '';
                    if (event.detail.value == 'MY REQUESTS') this.filtering = 'MY REQUESTS'; 
                    if (event.detail.value == 'OVERDUE REQUESTS') this.filtering = 'OVERDUE REQUESTS';  
                    if (event.detail.value == 'OPEN REQUESTS') this.filtering = 'OPEN REQUESTS';  
                    if (event.detail.value == 'CLOSED REQUESTS') this.filtering = 'CLOSED REQUESTS'; 
                    //console.log("value:" + event.detail.value + " filtering: " +this.filtering);
                } 
  }

    filterRangeFunc(startDate, searchStartDate, endDate, searchEndDate){
      // local compare
        if (!searchStartDate) return true;
        //if (!searchEndDate) return true; 
        // convert to milliseconds as coming in as two different formats
        var startDateMilli = new Date(startDate).getTime();
        var searchStartDateMilli = new Date(searchStartDate).getTime();
        var endDateMilli = new Date(endDate).getTime();
        var searchEndDateMilli = new Date(searchEndDate).getTime();
        // compare
        if (searchStartDateMilli > searchEndDateMilli) return true
        return (((searchStartDateMilli >= startDateMilli) && (searchStartDateMilli <= endDateMilli)) ||
              ((searchEndDateMilli >= startDateMilli) && (searchEndDateMilli <= endDateMilli)))
              
      }


  filterFunc(searchExpression, value, filter, user,seasons){
    // editorialName, pressHouse

    var searchVal = true;
    var filterVal = true;
    //this.closeExpanded ();

    if (searchExpression == '' && filter == '') return true;
    var itemValue ='';
    if (value.pressHouse) itemValue = value.pressHouse.name;
    if (value.brand)  itemValue = itemValue + ' ' + value.brand.name;
    if (value.prAgency) itemValue = itemValue + ' ' +  value.prAgency.name;
    if ((value.deliverTo) && value.deliverTo.pressHouse) itemValue = itemValue + ' ' + value.deliverTo.pressHouse.name;
    if ((value.deliverTo) && value.deliverTo.brand)  itemValue = itemValue + ' ' + value.deliverTo.brand.name;
    if ((value.deliverTo) && value.deliverTo.prAgency) itemValue = itemValue + ' ' + value.deliverTo.prAgency.name;
    if (value.editorialName) itemValue = itemValue + ' ' + value.editorialName;
    if (value.editorialWho) itemValue = itemValue + ' ' + value.editorialWho;
    if (value.requestingUser) itemValue = itemValue + ' ' + value.requestingUser.name + ' ' + value.requestingUser.surname;
    if (value.returnToName) itemValue = itemValue + ' ' + value.returnToName;
    if (value.returnToSurname) itemValue = itemValue + ' ' + value.returnToSurname;
    if (value.addressDestination) itemValue = itemValue + ' ' + value.addressDestination.name;
    if (value.id) itemValue = itemValue + ' ' + value.id; 
    // Get season abbreviation
    var i;
    var abbrev = '';
    for (i = 0; i < seasons.length; i++) {
        if (seasons[i].name == value.season) {
            abbrev = seasons[i].abbreviation;
        }
    }
    if (value.look && abbrev == '') itemValue = itemValue + ' ' +  value.look;//RM check added to index small request man
    if (value.look && abbrev != '') itemValue = itemValue + ' ' + abbrev+value.look;//RM check added to index small request man
    // Add sample id's to search list
    if (value.searchableItems){
      var i;
      for (i=0;i<value.searchableItems.length;i++)
        itemValue = itemValue + ' ' + value.searchableItems[i].clientID;
    }

    //console.log("Search value: " + itemValue);
    if(searchExpression && itemValue) searchVal = itemValue.toUpperCase().indexOf(searchExpression.toUpperCase()) !== -1;   

    if (filter == 'MY REQUESTS') {
      filterVal = (value.requestingUser.id == user.id);
    }
    if (filter == 'OVERDUE REQUESTS') {
      if (user.type == "brand" || user.type == "prAgency") filterVal = (value.requestStatusBrand == 'Overdue');
      if (user.type == "press" ) filterVal = (value.requestStatusPress == 'Overdue');
    }
    if (filter == 'OPEN REQUESTS') {
      if (user.type == "brand"  || user.type == "prAgency") filterVal = (value.requestStatusBrand != 'Closed');
      if (user.type == "press") filterVal = (value.requestStatusPress != 'Closed');
    }
    if (filter == 'CLOSED REQUESTS') {
      if (user.type == "brand" || user.type == "prAgency")  filterVal = (value.requestStatusBrand == 'Closed');
      if (user.type == "press" )  filterVal = (value.requestStatusPress == 'Closed');
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

  alertP (message){
      this.dialogService.open({ viewModel: CreateDialogAlert, model: {title:"Booking", message:message, timeout:5000} }).then(response => {});
  }

  /*
   *  Listen on channel for press or brand name
   *  for the current user, then reload bookings.
   * 
  */
  listenForBookingsCacheInvalidation(pubNub){
        console.log("listen for bookings cache invalidate - requestman.js");
        
        let company = this.user.company;
        let channel = company +'_cacheInvalidate';
        console.log("listening on cache channel in requestman:"+channel);
        let bookingsToUpdate = this.bookings;
        let sampleRequestService = this.sampleRequestService;
        
        var requestmanListener = {
            message: function updateBookingsIndex(message) {
                
                var channelName = message.channel;
                if(channelName === channel){
                    sampleRequestService.getSampleRequests().then(newBookings => { 
                        while(bookingsToUpdate.length > 0) {
                            bookingsToUpdate.pop();
                        }
                        newBookings.forEach(item => {
                            bookingsToUpdate.push(item);
                        });
                    });
                    toastr.options.preventDuplicates = true;
                    toastr.info('Request ' + message.message + " updated"); 
                }
            }
        }
        pubNub.addListener(requestmanListener);
        this.pubNubService.addRequestmanListener(requestmanListener);
        pubNub.subscribe({
            channels: [channel],
            withPresence: false 
        })
    }

    unbind(){
        console.log("UNBIND requestman ******* ")
        this.pubNubService.removeRequestmanListener();
    }

  editSampleRequest(itemId) {
    this.closeSampleRequestMenu(itemId);
    this.dialogService.open({viewModel: EditSampleRequest, model: itemId })
      .then(response => {
          
      });
  }
  

  denySampleRequest(id){
    this.closeSampleRequestMenu(id);
    this.sampleRequestService.denySampleRequest(id).then(message =>{
      this.alertP(message.message);
    });
  }
  approveSampleRequest(id){
    this.closeSampleRequestMenu(id);
    this.sampleRequestService.approveSampleRequest(id).then(message =>{
      this.alertP(message.message);
    });
  }
  sendSampleRequest(id){
    this.closeSampleRequestMenu(id);
    this.sampleRequestService.sendSampleRequest(id).then(message =>{
      this.alertP(message.message);
    });
  }
  markPickedUpSampleRequest(id){
    this.closeSampleRequestMenu(id);
    this.sampleRequestService.markPickedUpSampleRequest(id).then(message =>{
      this.alertP(message.message);
    });
  }
  markReturnedSampleRequest(id){
    this.closeSampleRequestMenu(id);
    this.sampleRequestService.markReturnedSampleRequest(id).then(message =>{
      this.alertP(message.message);
    });
  }
  restockedSampleRequest(id){
    this.closeSampleRequestMenu(id);
    this.sampleRequestService.restockedSampleRequest(id).then(message =>{
      this.alertP(message.message);
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
    });
    this.closeExpanded();
  }


  pressMarkReceivedSampleRequest(id){
    this.closeSampleRequestMenu(id);
    this.sampleRequestService.pressMarkReceivedSampleRequest(id).then(message =>{
      this.alertP(message.message);
    });
  }
  pressShipSampleRequest(id){
    this.closeSampleRequestMenu(id);
    this.sampleRequestService.pressShipSampleRequest(id).then(message =>{
      this.alertP(message.message);
    });
    
  }
  pressMarkPickedUpSampleRequest(id){
    this.closeSampleRequestMenu(id);
    this.sampleRequestService.pressMarkPickedUpSampleRequest(id).then(message =>{
      this.alertP(message.message);
    });
  }
  pressDeleteSampleRequest(id){
    this.closeSampleRequestMenu(id);
    this.sampleRequestService.pressDeleteSampleRequest(id).then(message =>{
      this.alertP(message.message);
    });
  }
    

  lookEditMenu(id){
    var menu = document.getElementById("requestManTest"+id);
    menu.classList.toggle("look-menu-show");
  }


}