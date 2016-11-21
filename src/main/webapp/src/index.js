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

  deactivate() {
   window.removeEventListener('keypress', this.boundHandler);
  }

  handleKeyInput(event) {
    console.log(event);
    if(event.which == 13 && event.srcElement.id === 'search-images') {
      console.log("user hit enter");
      this.filterChange(event);
    }
    if(event.which == 13 && event.srcElement.id === 'msgInput') {
      console.log("user hit enter");
      sendMessage2();
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

  //Brand Functions
  denySampleRequest(id){
    this.closeSampleRequestMenu(id);
    this.sampleRequestService.denySampleRequest(id).then(message =>{alert(message.message);});
  }
  shipSampleRequest(id){
    this.closeSampleRequestMenu(id);
    this.sampleRequestService.shipSampleRequest(id).then(message =>{alert(message.message);});
  }
  sendSampleRequest(id){
    this.closeSampleRequestMenu(id);
    this.sampleRequestService.sendSampleRequest(id).then(message =>{alert(message.message);});
  }
  markPickedUpSampleRequest(id){
    this.closeSampleRequestMenu(id);
    this.sampleRequestService.markPickedUpSampleRequest(id).then(message =>{alert(message.message);});
  }
  markReturnedSampleRequest(id){
    this.closeSampleRequestMenu(id);
    this.sampleRequestService.markReturnedSampleRequest(id).then(message =>{alert(message.message);});
  }
  restockedSampleRequest(id){
    this.closeSampleRequestMenu(id);
    this.sampleRequestService.restockedSampleRequest(id).then(message =>{alert(message.message);});
  }
  deleteSampleRequest(id){
    this.closeSampleRequestMenu(id);
    this.sampleRequestService.deleteSampleRequest(id).then(message =>{alert(message.message);});
  }

  //Press Functions
  pressMarkReceivedSampleRequest(id){
    this.closeSampleRequestMenu(id);
    this.sampleRequestService.markReceivedSampleRequest(id).then(message =>{alert(message.message);});
  }
  pressShipSampleRequest(id){
    this.closeSampleRequestMenu(id);
    this.sampleRequestService.pressShipSampleRequest(id).then(message =>{alert(message.message);});
  }
  pressMarkPickedUpSampleRequest(id){
    this.closeSampleRequestMenu(id);
    this.sampleRequestService.pressMarkPickedUpSampleRequest(id).then(message =>{alert(message.message);});
  }
  pressDeleteSampleRequest(id){
    this.closeSampleRequestMenu(id);
    this.sampleRequestService.pressDeleteSampleRequest(id).then(message =>{alert(message.message);});
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


// The Realtime client connection
var ortcClient;

// The Realtime channel
var chatChannel = "chat";

// The current user id (random between 1 and 1000)
var myId = "ID_" + Math.floor((Math.random() * 1000) + 1);

// We start here ...
$(function() {
  connectToRealtime2();
});

// Connect to the Realtime cluster
function connectToRealtime2() {
  loadOrtcFactory(IbtRealTimeSJType, function(factory, error) {
    ortcClient = factory.createClient();
    ortcClient.setClusterUrl('https://ortc-developers.realtime.co/server/ssl/2.1/');
    
    console.log("Connecting to Realtime ...");
    ortcClient.connect('2Ze1dz', 'anonymousToken');

    // we need to wait for the connection to complete
    // before we subscribe the channel
    ortcClient.onConnected = function(ortc) {
      $("#log").html("Connected");
      
      // subscribe the chat channel
      // the onChatMessage callback function will handle new messages
      ortcClient.subscribe(chatChannel, true, onChatMessage2);
    }
  });
}

// Handle a received chat message
function onChatMessage2(ortc, channel, message) {
  var receivedMessage = JSON.parse(message);
  var msgAlign = (receivedMessage.id == myId ? "right" : "left");
  
  // format message to show on log
  var msgLog = "<div style='text-align:" + msgAlign + "' class='grid-block inter-message-gap align-" + msgAlign + "'>";
  msgLog += "<span>"+ receivedMessage.text + "<br><span>";
  msgLog += "<span class='time'>" + receivedMessage.sentAt + "</span></div>"
  
  // add the message to the chat log
  Log2(msgLog);
}

// Send a new chat message
function sendMessage2() {
  var message = {
    id: myId,
    text: $("#msgInput").val(),
    sentAt: new Date().toLocaleTimeString()
  };
  
  ortcClient.send(chatChannel, JSON.stringify(message));
  
  // clear the input field
  $('#msgInput').val("");
}

// Adds text to the chat log
function Log2(text) {
 // $("#message-container").html($("#message-container").html() + text);
  $("#message-container").append(text);
  $("#message-container-dad").animate({scrollTop: $("#message-container-dad").prop("scrollHeight")}, 500);
  console.log(text);
}

// Bind keypress to send message on enter key press
$("#msgInput").bind("keypress", function(e) {
  if(e.keyCode == 13) {
    sendMessage2();
  }
});





