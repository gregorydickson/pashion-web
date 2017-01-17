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
import {BrandService} from './services/brandService';
import {AddFilesDialog} from './add_files/add_files';
import {ErrorDialogSample} from './error_dialog/error_dialog_sample';


@inject(HttpClient, EventAggregator, DialogService,SampleRequestService, UserService, BrandService)
export class Index {
  user = {};
  bookings = [];
  rows = [];
  seasons = [];
  brands = [];
  itemTypes = [];
  colors = [];
  
  selectedBrand = '';
  season = '';
  selectedItemType = '';
  selectedColor = '';
  searchText = '';
  availableFrom = '';
  availableTo = '';
  selectedSeason = '';
  selectedTheme = '';
  maxR = 500;
  maxRReached = false;
  numberImages = 0;
  
  
  filterChange(event){
    console.log("Filter Change changing");
    if(event)
      if(event.detail)
        if(event.detail.value){
          this.selectedBrand = event.detail.value;
          console.log("value:"+event.detail.value)
        }
     
    console.log("brand:"+this.selectedBrand);
    console.log("season:"+this.season);
    console.log(this.selectedItemType);
    console.log(this.searchText);
    console.log(this.availableFrom);
    console.log(this.availableTo);
    this.numberImages = 0;
    this.maxRReached = false;
    this.http.fetch('/searchableItem/filterSearch?searchtext='+ encodeURI(this.searchText) +                                      
                                      '&itemType=' + this.selectedItemType + 
                                      '&availableFrom=' + this.availableFrom + 
                                      '&availableTo=' + this.availableTo +
                                      '&maxR=' + this.maxR)
          .then(response => response.json())
          .then(rows => {
            if(rows.session == 'invalid'){
                window.location.href = '/user/login';
                return;
            }
            this.rows = rows;
            if (rows.length >0) {
            this.numberImages = (rows.length -1) * rows[0].numberImagesThisRow;
            this.numberImages += rows[rows.length-1].numberImagesThisRow;
            if (this.numberImages==this.maxR) this.maxRReached = true;
          }})

         .then (anything => setTimeout (function () {$("img.lazy").unveil();}, 1000)) // initial unveil of first images on load
         .then (result => $('div.cards-list-wrap').animate({scrollTop: $('div.cards-list-wrap').offset().top - 250}, 'slow')) // scroll to top


          ;
  }

  filterChangeBrand(event){
    console.log("Filter Change changing Brand");
    if(event)
      if(event.detail)
        if(event.detail.value){
          this.selectedBrand = event.detail.value;
          console.log("value:"+event.detail.value)
        }
    console.log("Filter change called, Brand: " + this.selectedBrand);
    this.numberImages = 0;
    this.maxRReached = false;
    this.http.fetch('/searchableItem/filterSearch?searchtext='+ encodeURI(this.searchText) + 
                                      '&brand=' + this.selectedBrand + 
                                     '&season=' + encodeURI(this.selectedSeason) + 
                                      '&theme='+ this.selectedTheme+
                                      '&maxR=' + this.maxR)
          .then(response => response.json())
          .then(rows => {
            if(rows.session == 'invalid'){
                window.location.href = '/user/login';
                return;
            }
            this.rows = rows;
            if (rows.length >0) {
            this.numberImages = (rows.length -1) * rows[0].numberImagesThisRow;
            this.numberImages += rows[rows.length-1].numberImagesThisRow;
            if (this.numberImages==this.maxR) this.maxRReached = true;
          }})

         .then (anything => setTimeout (function () {$("img.lazy").unveil();}, 1000)) // initial unveil of first images on load
         .then (result => $('div.cards-list-wrap').animate({scrollTop: $('div.cards-list-wrap').offset().top - 250}, 'slow')) // scroll to top



          ;

  }

  filterChangeSeason(event){
    console.log("Filter Change changing Season");
    this.selectedSeason = '';
    if(event)
      if(event.detail)
        if(event.detail.value){
          this.selectedSeason = event.detail.value;
          console.log("value:"+event.detail.value)
        }
    console.log("Filter change called, Season: " + this.selectedSeason);
    this.numberImages = 0;
    this.maxRReached = false;
    this.http.fetch('/searchableItem/filterSearch?searchtext='+ encodeURI(this.searchText) + 
                                      '&brand=' + this.selectedBrand + 
                                     '&season=' + encodeURI(this.selectedSeason) + 
                                      '&theme='+ this.selectedTheme+
                                      '&maxR=' + this.maxR)
          .then(response => response.json())
          .then(rows => {
            if(rows.session == 'invalid'){
                window.location.href = '/user/login';
                return;
            }
            this.rows = rows;
            if (rows.length >0) {
            this.numberImages = (rows.length -1) * rows[0].numberImagesThisRow;
            this.numberImages += rows[rows.length-1].numberImagesThisRow;
            if (this.numberImages==this.maxR) this.maxRReached = true;
          }})

         .then (anything => setTimeout (function () {$("img.lazy").unveil();}, 1000)) // initial unveil of first images on load
         .then (result => $('div.cards-list-wrap').animate({scrollTop: $('div.cards-list-wrap').offset().top - 250}, 'slow')) // scroll to top


          ;

  }

    filterChangeTheme(event){
    console.log("Filter Change changing Theme");
    this.selectedTheme = '';
    if(event)
      if(event.detail)
        if(event.detail.value){
          if(event.detail.value=='All') event.detail.value = '';
          if(event.detail.value=='Select') event.detail.value = '';

          this.selectedTheme = event.detail.value;
          console.log("value:"+event.detail.value)
        }
    console.log("Filter change called, Theme: " + this.selectedTheme);
    this.numberImages = 0;
    this.maxRReached = false;
    this.http.fetch('/searchableItem/filterSearch?searchtext='+ encodeURI(this.searchText) + 
                                      '&brand=' + this.selectedBrand + 
                                     '&season=' + encodeURI(this.selectedSeason) + 
                                     // '&season=' + this.selectedSeason + 
                                      '&theme='+ this.selectedTheme+
                                      '&maxR=' + this.maxR)
          .then(response => response.json())
          .then(rows => {
            if(rows.session == 'invalid'){
                window.location.href = '/user/login';
                return;
            }
            this.rows = rows;
            if (rows.length >0) {
            this.numberImages = (rows.length -1) * rows[0].numberImagesThisRow;
            this.numberImages += rows[rows.length-1].numberImagesThisRow;
            if (this.numberImages==this.maxR) this.maxRReached = true;
          }})
          
         .then (anything => setTimeout (function () {$("img.lazy").unveil();}, 1000)) // initial unveil of first images on load
         .then (result => $('div.cards-list-wrap').animate({scrollTop: $('div.cards-list-wrap').offset().top - 250}, 'slow')) // scroll to top


          ;

  }

  constructor(http, eventAggregator,dialogService,sampleRequestService,userService, brandService) {
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
    this.brandService = brandService;
    this.maxRReached = false;
    this.numberImages = 0;

  }

  //activate() is called before attached()
  activate() {
    
    
    return Promise.all([
      this.http.fetch('/dashboard/seasons').then(response => response.json()).then(seasons => this.seasons = seasons),
      this.http.fetch('/dashboard/itemTypes').then(response => response.json()).then(itemTypes => this.itemTypes = itemTypes),
      //this.http.fetch('/brand/fastList').then(response => response.json()).then(brands => this.brands = brands),
      this.brandService.getBrands().then (brands => this.brands = brands),
      this.http.fetch('/dashboard/colors').then(response => response.json()).then(colors => this.colors = colors),
      this.bookings = this.sampleRequestService.getSampleRequests().then(bookings => this.bookings = bookings),
      this.user = this.userService.getUser().then(user => {
        this.user = user;
        if (this.user.type ==="guest") window.location.href = '/user/login';
        if (this.user.type === "brand") this.selectedBrand = user.companyId;
      })

    ]);
  }
  attached () {
    this.subscriber = this.ea.subscribe('datepicker', response => {
            if(response.elementId === 'datepickerto')
              this.availableTo = response.elementValue;
            if(response.elementId === 'datepickerfrom') 
              this.availableFrom = response.elementValue;
            if((this.availableTo && this.availableFrom) || (this.availableFrom) )
              this.filterChange();
            
    });
    let show = this.userService.show();
    if(show){
      this.dialogService.open({viewModel: Introduction, model: "no-op" }).then(response => {
        this.userService.introShown();
      });
    }

    this.filterChangeBrand();

    var parent = this;
    $('input[type=search]').on('search', function () {
    // search logic here
    // this function will be executed on click of X (clear button)
      parent.filterChangeBrand(event)});

    // Three dots Menu dropdown close when click outside
    $('body').click(function() {      
      $(".look-menu-absolute").each(function () {
        $(this).removeClass("look-menu-show");
      });
    });

    //Select functionality for brand and agency users to toggle/show "search images"/"manage images" blocks
    // Show/hide on document ready
      $('.blockSearchImages').show();
      $('.blockManageImages').hide();
    
    //Show/hide on select  
      $('#imagesFunctionality').change(function(){
        if($(this).val() == 'optionSearchImages'){ 
          $('.blockSearchImages').show();
          $('.blockManageImages').hide();
        }
        else if ($(this).val() == 'optionManageImages'){ 
          $('.blockSearchImages').hide();
          $('.blockManageImages').show();
        }
      });

    document.getElementById('search-images').addEventListener('keypress', this.boundHandler, false);

    //Set height of scrollable list of looks 
    function mainScrollWindowHeight () {
      var emptySpace = 0;
      var setHeight = $(window).height() - $('.footer').outerHeight() - $('.cards-list-wrap').offset().top - emptySpace;
          $('.cards-list-wrap').css('height', setHeight);        
    }
    mainScrollWindowHeight();
    $(window).resize(function() {
        mainScrollWindowHeight();
    });
  }
  detached() {
   window.removeEventListener('keypress', this.boundHandler);
  }

  handleKeyInput(event) {
   //console.log(event);
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
    // this.lookMenu(itemId);
    this.dialogService.open({viewModel: CreateSampleRequest, model: itemId })
      .then(response => {
        this.bookings = this.sampleRequestService.getSampleRequests().then(bookings => this.bookings = bookings);
      });
  }

  checkAvailabilitySearchableItem(itemId) {
    //this.lookMenu(itemId);
    this.dialogService.open({viewModel: CheckAvailability, model: itemId })
      .then(response => {});
  }

  setAvailabilitySearchableItem(itemId) {
    //this.lookMenu(itemId);
    this.dialogService.open({viewModel: SetAvailability, model: itemId })
      .then(response => {});
  }

  editSearchableItem(itemId) {
    //this.lookMenu(itemId);
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



  createZoomDialog(item,rowNumber,itemNumber) {
    console.log("item number :"+itemNumber);
    console.log("item  :"+item);
    let menu = document.getElementById("card-"+item.id);
    
    menu.classList.toggle("blue-image");
    let zoomModel = {};
    zoomModel.item = item;
    zoomModel.rows = this.rows;
    zoomModel.itemNumber = itemNumber;
    zoomModel.rowNumber = rowNumber;
    this.dialogService.open({viewModel: Zoom, model: zoomModel })
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


}









