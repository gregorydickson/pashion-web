import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import {EventAggregator} from 'aurelia-event-aggregator';
import {DialogService} from 'aurelia-dialog';
import 'fetch';
import {CreateSampleRequest} from './sample_request/createSampleRequest';
import {EditSampleRequest} from './sample_request/editSampleRequest';
import {EditSearchableItem} from './items/editSearchableItem';
import {CheckAvailability} from './items/checkAvailability';
import {SetAvailability} from './items/setAvailability';
import {Introduction} from './hello/introduction';
import {Zoom} from './zoom/zoom';
import {SampleRequestService} from './services/sampleRequestService';
import {UserService} from './services/userService';
import {AddFilesDialog} from './add_files/add_files';
import {ErrorDialogSample} from './error_dialog/error_dialog_sample';


@inject(HttpClient, EventAggregator, DialogService,SampleRequestService, UserService)
export class Index {
  user = {};
  bookings = [];
  rows = [];
  seasons = [];
  brands = [];
  itemTypes = [];
  colors = [];
  
  selectedBrand = '';
  selectedSeason = '';
  selectedItemType = '';
  selectedColor = '';
  searchText = '';
  availableFrom = '';
  availableTo = '';

  numberImages = 0;
  
  
  filterChange(event){
    console.log("changing");
    console.log(this.selectedBrand);
    console.log(this.selectedSeason);
    console.log(this.selectedItemType);
    console.log(this.searchText);
    console.log(this.availableFrom);
    console.log(this.availableTo);

    this.http.fetch('/searchableItem/filterSearch?searchtext='+ encodeURI(this.searchText) + 
                                      '&brand=' + this.selectedBrand + 
                                      '&season=' + encodeURI(this.selectedSeason) + 
                                      '&itemType=' + this.selectedItemType + 
                                      '&availableFrom=' + this.availableFrom + 
                                      '&availableTo=' + this.availableTo)
          .then(response => response.json())
          .then(rows => {this.rows = rows})
          .then(rows => {this.numberImages = this.rows[0].numberImages});
  }


  constructor(http, eventAggregator,dialogService,sampleRequestService,userService) {
    http.configure(config => {
      config
        .useStandardConfiguration();
    });
    this.ea = eventAggregator;
    this.http = http;
    this.boundHandler = this.handleKeyInput.bind(this);
    this.dialogService = dialogService;
    this.sampleRequestService = sampleRequestService;
    this.userService = userService;

  }


  attached(){
    this.subscriber = this.ea.subscribe('datepicker', response => {
            if(response.elementId === 'datepickerto')
              this.availableTo = response.elementValue;
            if(response.elementId === 'datepickerfrom') 
              this.availableFrom = response.elementValue;
            this.filterChange();
            
    });
    this.dialogService.open({viewModel: Introduction, model: "no-op" }).then(response => {});
  }

  activate() {
    window.addEventListener('keypress', this.boundHandler, false);
    
    return Promise.all([
      this.http.fetch('/dashboard/seasons').then(response => response.json()).then(seasons => this.seasons = seasons),
      this.http.fetch('/dashboard/itemTypes').then(response => response.json()).then(itemTypes => this.itemTypes = itemTypes),
      this.http.fetch('/brand/index.json').then(response => response.json()).then(brands => this.brands = brands),
      this.http.fetch('/dashboard/colors').then(response => response.json()).then(colors => this.colors = colors),
      this.bookings = this.sampleRequestService.getSampleRequests().then(bookings => this.bookings = bookings),
      this.user = this.userService.getUser().then(user => {
        this.user = user;
        if (this.user.type ==="guest") window.location.href = '/user/login';
      })

    ]);
  }

  detached() {
   window.removeEventListener('keypress', this.boundHandler);
  }

  handleKeyInput(event) {
    console.log(event);
    if(event.which == 13 && event.srcElement.id === 'search-images') {
      console.log("user hit enter");
      this.filterChange(event);
    }
  }
 
  /* RM Sample Request - accordion expansion button */
  closeExpand(buttonNumber) {
    var buttonChoice = document.getElementById("button" + buttonNumber);
    var panelChoice = document.getElementById("panel" + buttonNumber);
    buttonChoice.classList.toggle("active");
    panelChoice.classList.toggle("show");  
  }

  lookMenu(id){
    var menu = document.getElementById("look-"+id);
    menu.classList.toggle("look-menu-show");
  }

  

  createSampleRequest(itemId) {
    this.lookMenu(itemId);
    this.dialogService.open({viewModel: CreateSampleRequest, model: itemId })
      .then(response => {
        this.bookings = this.sampleRequestService.getSampleRequests().then(bookings => this.bookings = bookings);
      });
  }

  checkAvailabilitySearchableItem(itemId) {
    this.lookMenu(itemId);
    this.dialogService.open({viewModel: CheckAvailability, model: itemId })
      .then(response => {});
  }

  setAvailabilitySearchableItem(itemId) {
    this.lookMenu(itemId);
    this.dialogService.open({viewModel: SetAvailability, model: itemId })
      .then(response => {});
  }

  editSearchableItem(itemId) {
    this.lookMenu(itemId);
    this.dialogService.open({viewModel: EditSearchableItem, model: itemId })
      .then(response => {});
  }

  sampleRequestMenu(id){
    var menu = document.getElementById("requestTest"+id);
    menu.classList.toggle("look-menu-show");
  }

  closeSampleRequestMenu(id){
    var menu = document.getElementById("requestTest"+id);
    menu.classList.toggle("look-menu-show");
  }

  editSampleRequest(id) {
    this.closeSampleRequestMenu(id);
    this.dialogService.open({viewModel: EditSampleRequest, model: id }).then(response => {});
  }

  //Brand Workflow Functions
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

  reloadBookings(){
    this.bookings = this.sampleRequestService.getSampleRequests().then(bookings => this.bookings = bookings);
  }

  //Press Workflow Functions
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



  // Zoom image
  createZoomDialog(itemId) {
    var menu = document.getElementById("card-"+itemId);
    menu.classList.toggle("blue-image");
    this.dialogService.open({viewModel: Zoom, model: itemId })
      .then(response => {
        menu.classList.toggle("blue-image");
      });
  }

  // Add files (Add images) dialog
  createAddfilesDialog() {
    this.dialogService.open({viewModel: AddFilesDialog, model: "no-op" })
      .then(response => {});
  }  

  // Create error dialog sample
  createErrorDialogSample() {
      this.dialogService.open({viewModel: ErrorDialogSample, model: "no-op" })
        .then(response => {}); 
  } 

  connectToRealtime()
  {
    connectToRealtime2();
  }

  onChatMessage(ortc, channel, message)
  {
    onChatMessage2(ortc, channel, message);
  }

  sendMessage()
  {
    sendMessage2();
  }

  Log(text)
  {
    Log2(text);
  }


}









