import { DialogController } from 'aurelia-dialog';
import { HttpClient, json } from 'aurelia-fetch-client';
import 'fetch';
import { inject, bindable } from 'aurelia-framework';
import { DateFormat } from 'common/dateFormat';
import { BrandService } from 'services/brandService';
import { OutReasonService } from 'services/outReasonService';
import { PRAgencyService } from 'services/PRAgencyService';
import { UserService } from 'services/userService';
import { DialogService } from 'aurelia-dialog';
import { CreateDialogAlert } from 'common/dialogAlert';
import $ from 'jquery';
import { computedFrom } from 'aurelia-framework';
import { SampleRequestService } from 'services/sampleRequestService';
import { SearchableItemService } from 'services/searchableItemService';
import { busy } from 'services/busy';



@inject(HttpClient, DialogController, BrandService, 
    DialogService, UserService, OutReasonService, 
    PRAgencyService,SampleRequestService, SearchableItemService, busy)
export class CreateSampleRequestBrand {

  
  currentItem = null;
  startCalendar = null;
  endCalendar = null;
  isLoading = true;
  @bindable startFinalize = false;
  @bindable edit = false;
  selectAll = true;
  required = [];

  availableReturnToItems = [];
  selectedReturnToItems = [""];

  hideCalendar = false;
  @bindable user = {};
  
  @bindable restrictOutsideBooking = false;

  brand = [];

  returnBy = [];

  courier = [];
  payment = [];

  emailOptions = ['EMAIL'];
  email = null;

  selectedAddress = {};
  returnToAddress = null;

  sampleRequest = null;

  times = [];
  startDay = '';
  endDay = '';

  constructor(http, controller, brandService, dialogService,userService, outReasonService, PRAgencyService,sampleRequestService, searchableItemService, busy) {
    this.controller = controller;
    console.log("createSampleRequestBrand");
    http.configure(config => {
      config
        .useStandardConfiguration();
    });
    this.http = http;
    this.brandService = brandService;
    this.dialogService = dialogService;
    this.userService = userService;
    this.prAgencyService = PRAgencyService;
    this.outReasonService = outReasonService;
    this.sampleRequestService = sampleRequestService;
    this.searchableItemService = searchableItemService;
    this.busy = busy;
  }


  activate(item) {
    

    this.sampleRequest = this.sampleRequestService.getCurrentSampleRequest();

    var queryStringEnd = DateFormat.urlString(this.sampleRequest.endOffset, 1)+ '&searchType=brand';
    var queryStringStart = DateFormat.urlString(this.sampleRequest.startOffset, 1)+ '&searchType=brand';

    if(this.sampleRequest.requestStatusBrand === 'Finalizing' ||
     this.sampleRequest.requestStatusBrand === 'Approved' ||
     this.sampleRequestService.sampleRequestStatus == 'edit'){
      
      console.log("sr status:"+this.sampleRequestService.sampleRequestStatus);
      if(this.sampleRequestService.sampleRequestStatus == 'edit')
        this.edit = true;
      

      this.startFinalize = true;
      this.sampleRequest.datesSaved = true;
      
      return Promise.all([
        this.userService.getUser().then(user => {
          this.user = user;
          if(user.prAgency){
            this.prAgencyService.getPRAgencyAddresses(user.prAgency.id).then(addresses => {
              this.returnTo = addresses;
              addresses.forEach(item => {
                this.availableReturnToItems.push({
                  id: item.id,
                  text: item.name
                });
              });
              this.addressInit();
            })
          } else{
            this.brandService.getBrandAddresses(user.brand.id).then(addresses => {
              this.returnTo = addresses;
              addresses.forEach(item => {
                this.availableReturnToItems.push({
                  id: item.id,
                  text: item.name
                });
              });
              this.addressInit();
            })
          }
        }),
        
        this.http.fetch('/dashboard/required').then(response => response.json()).then(required => {
          this.required = required;
        }),
        this.http.fetch('/dashboard/returnBy').then(response => response.json()).then(returnBy => {
          this.returnBy = returnBy;
        }),
        this.http.fetch('/dashboard/courier').then(response => response.json()).then(courier => {
          this.courier = courier;
        }),
        this.http.fetch('/dashboard/times').then(response => response.json()).then(times => this.times = times),
        this.http.fetch('/dashboard/payment').then(response => response.json()).then(payment => {
          this.payment = payment;
        })
          
      ])
    } else{
      return Promise.all([
        this.userService.getUser().then(user => {this.user = user}),
        this.http.fetch('/calendar/searchableItemPicker' + queryStringStart + '&item=' + item.id)
          .then(response => response.json())
          .then(calendar => {
            this.startCalendar = calendar;
          }),
        this.http.fetch('/calendar/searchableItemPicker' + queryStringEnd + '&item=' + item.id)
          .then(response => response.json())
          .then(calendar => {
            this.endCalendar = calendar;
          }),
        this.outReasonService.getOutReasons().then(outReasons => {
          //sparse array?
          this.outReasons = outReasons.map(value => {return {id: value.id, name:value.name.toUpperCase()} } )
        }),
        this.http.fetch('/dashboard/seasons').then(response => response.json()).then(seasons => this.seasons = seasons),
        this.http.fetch('/searchableItems/' + item.id + '.json')
          .then(response => response.json())
          .then(item => {
            if (item.session == 'invalid') {
              window.location.href = '/user/login';
              return;
            }
            this.currentItem = item;
            if(this.sampleRequest.datesSaved){
              console.log("checking availability new item");
              this.checkAvailabilty(item);
            }
            
            this.brandService.getBrand(item.brand.id).then(brand => {this.brand = brand});
          })
      ])
    }
  }


  attached() {
    this.isLoading = false;
    console.log("dates saved:"+this.sampleRequest.datesSaved);
    if(this.sampleRequest.addressDestination){
      this.selectedAddress = this.sampleRequest.addressDestination;
    }

    if(this.currentItem)
      this.checkSamples();
    ga('set', 'page', '/createSampleRequestBrand.html');
    ga('send', 'pageview');
  }

  checkAvailabilty(item){
    this.searchableItemService.checkItemsAvailability({item:item,sampleRequest:this.sampleRequest})
      .then(result =>{
        item.samples.forEach(function(sample) {
          sample.availability = result.find(function (availability) {
            return sample.id === availability.id;
          }).availability;
        });
        
        var ids = this.sampleRequest.searchableItemsProposed;
        item.samples.forEach(function (sample) {
          let inTrolley = ids.find(item => {return sample.id === item.id});

          if(sample.availability && (!inTrolley)){
            ids.push(sample);  
          }
          
        })
        
      });
  }

  addressInit(){
    let defaultAddress = this.returnTo.find(item => item.defaultAddress == true);
    if (defaultAddress) {
      let availableReturnToItems = this.availableReturnToItems;
      let selectedReturnTo = availableReturnToItems.find(item => item.id == defaultAddress.id);
      this.sampleRequest.returnToAddress = selectedReturnTo.id;
      this.selectedReturnToItems = [selectedReturnTo.id];
    }

    if(this.sampleRequest.returnToAddress){
      let availableReturnToItems = this.availableReturnToItems;
      let selectedReturnTo = availableReturnToItems.find(item => item.id == this.sampleRequest.returnToAddress.id);
      this.selectedReturnToItems = [selectedReturnTo.id];
      
    }
  }

  checkSamples(){
    let user = this.user;
    if (user.type == "brand"){
      this.brandService.getRestrictOutsideBooking(this.user.brand.id).then(result => {
        console.log("restrict Outside booking:"+result)
        // currently disabled, so always false
        // but can use for not-available locations??
        this.restrictOutsideBooking = result;
        var theUser = this.user;

        var ids = this.sampleRequest.searchableItemsProposed;
        this.currentItem.samples.forEach(function (item,index,object) {
          if(result){
            if(item.sampleCity.name == theUser.city.name ){
              //ids.push(item);
            } else {
              console.log("not adding to selected");
            }
          } else {
            //ids.push(item);
          }
          
        })

      });
    }
    if (user.type=="prAgency"){
      this.prAgencyService.getRestrictOutsideBooking(this.user.prAgency.id).then(result =>{ 
        console.log("restrict Outside booking:"+result)
        this.restrictOutsideBooking = result;
        var theUser = this.user;

        var ids = this.sampleRequest.searchableItemsProposed;
        this.currentItem.samples.forEach(function (item,index,object) {
          if(result){
            if(item.sampleCity.name == theUser.city.name ){
              //ids.push(item);
            } 
          } else {
            //ids.push(item);
          }
          
        })
      });
    }
  }

  onSelectAddressChangeCallback(event) {
    console.log('onSelectAddressChangeCallback() called:', event.detail.value);
    if (event.detail.value.selectedAddress) {
      this.selectedAddress = event.detail.value.selectedAddress;
      this.sampleRequest.deliverTo = event.detail.value.selectedAddress;
    }
  }

  onReturnToChangeCallback(event) {
    console.log('onReturnToChangeCallback() called:', event.detail.value);
    if (event.detail.value) {
      let selectedReturnToId = event.detail.value;
      let selectedReturnTo = this.returnTo.find(item => item.id == selectedReturnToId);
      console.log('Selected returnTo:', selectedReturnTo);
      this.sampleRequest.returnToAddress = selectedReturnToId;
    }
  }

  alertP(message) {
    return this.dialogService.open({ viewModel: CreateDialogAlert, model: { title: "Booking", message: message, timeout: 5000 }, lock: false });
  }

  setStartDate(event, dayEvent, day) {
    console.log("set start date: " + event);
    console.log("parameterday: " + day);
    if(this.sampleRequest.datesSaved){
      console.log("dates already saved returning");
      return;
    }
    console.log("dates not saved, setting start date");
    var today = new Date();    
    var yesterday = 0;
    var todayMilli = today.getTime();
    yesterday = todayMilli - (24*60*60*1000);

    this.sampleRequest.startDay = day;
    var enddate = '';
    if (this.sampleRequest.endDay != '') enddate = new Date(this.endCalendar.calendarMonths[0].year, this.endCalendar.calendarMonths[0].monthNumber - 1, this.sampleRequest.endDay);
    let startdate = new Date(this.startCalendar.calendarMonths[0].year, this.startCalendar.calendarMonths[0].monthNumber - 1, day);

    // quit if in the past
    // could also add in here, any business logic about if we want to book +1 day out?
    console.log("today: " + today);
    console.log("startdate: " + startdate);
    console.log("startDay: " + this.startDay);
    if (this.sampleRequest.endDay != '') console.log("enddate: " + enddate); else console.log("no endDay set")
    console.log("endDay: " + this.endDay);
    if (startdate.getTime() <= yesterday) {
      console.log("day is before today.");
      this.sampleRequest.startDay = '';
      this.sampleRequest.startDate = '';
      this.sampleRequest.startMonth = '';

      // also clear end date
      this.sampleRequest.endDate = '';
      this.sampleRequest.endDay = '';
      this.sampleRequest.endMonth = '';
      
      return;
    }
    console.log("day is in the future");
    
    this.sampleRequest.startDate = this.startCalendar.calendarMonths[0].year + "-" + this.startCalendar.calendarMonths[0].monthNumber + "-" + day;
    this.sampleRequest.startMonth = this.startCalendar.calendarMonths[0].monthNumber;
    this.sampleRequest.startDay = day;
  }

  setEndDate(event, dayEvent, day) {
    if(this.sampleRequest.datesSaved){
      console.log("dates already saved returning");
      return;
    }
    this.sampleRequest.endDay = day;
    var startdate = '';
    let enddate = new Date(this.endCalendar.calendarMonths[0].year, this.endCalendar.calendarMonths[0].monthNumber - 1, day);
    if (this.sampleRequest.startDay != '') startdate = new Date(this.startCalendar.calendarMonths[0].year, this.startCalendar.calendarMonths[0].monthNumber - 1, this.sampleRequest.startDay);
    var today = new Date();    
    var yesterday = 0;
    var todayMilli = today.getTime();
    yesterday = todayMilli - (24*60*60*1000);

    console.log("today: " + today);
    if (this.sampleRequest.startDay != '') console.log("startDay: " + this.sampleRequest.startDay);
    else {
      console.log("no startDay set, exit");
      this.sampleRequest.endDay = '';
      this.sampleRequest.endDate = '';
      this.sampleRequest.endDay = '';
      this.sampleRequest.endMonth = '';
      return;
    }
    console.log("startdate: " + startdate);
    console.log("enddate: " + enddate);
    console.log("endDay: " + this.sampleRequest.endDay);
    if (enddate.getTime() <= yesterday) {
      console.log("day is before today.");
      this.sampleRequest.endDay = '';
      this.sampleRequest.endDate = '';
      this.sampleRequest.endDay = '';
      this.sampleRequest.endMonth = '';
      return;
    }
    console.log("day is in the future");

    if (this.sampleRequest.startDay === '' || enddate < startdate ) {
      console.log(" empty, reverse ");
      this.sampleRequest.endDay = '';
      this.sampleRequest.endDate = '';
      this.sampleRequest.endDay = '';
      this.sampleRequest.endMonth = '';
      return;
    }
    console.log("end date" + event);
    console.log("day" + day);
    
    this.sampleRequest.endDate = this.endCalendar.calendarMonths[0].year + "-" + this.endCalendar.calendarMonths[0].monthNumber + "-" + day;
    this.sampleRequest.endMonth = this.endCalendar.calendarMonths[0].monthNumber;
    this.sampleRequest.endDay = day;
  }

  

  removeSample(sample){
    console.log("sample:"+sample.id);
    let toRemove = this.sampleRequest.searchableItemsProposed.findIndex(item => {return sample.id == item.id});
    
    console.log("removing:"+toRemove);
    this.sampleRequest.searchableItemsProposed.splice(toRemove,1);
    
  }

  submitCheck() {

    if ((this.sampleRequest.searchableItemsProposed === undefined) ||
      (this.sampleRequest.searchableItemsProposed.length == 0) ||
      (this.sampleRequest.startDate === undefined) ||
      (this.sampleRequest.startDate == '') ||
      (this.sampleRequest.endDate === undefined) ||
      (this.selectedAddress.name === undefined) ||
      (this.sampleRequest.returnToAddress === undefined) ||
      (this.sampleRequest.endDate == '')) {
        this.isLoading = true;
        this.sampleReqestService.updateSampleRequest()
            .then(result => {
              this.isLoading = false;
              this.alertP("Request Sent");
              this.controller.ok();
            });

      }
  }

  redraw(element) {
    element.style.display = 'none';
    element.offsetHeight;
    element.style.display = '';
  }

  startNext(){
    ++this.sampleRequest.startOffset;
    this.updateAvailability(false);
  }
  startPrevious() {
    --this.sampleRequest.startOffset;
    this.updateAvailability(false);
  }
  startReset() {
    this.sampleRequest.startOffset = 0;
    this.updateAvailability(false);
  }
  endNext() {
    ++this.sampleRequest.endOffset;
    this.updateAvailability(false);
  }
  endPrevious() {
    --this.sampleRequest.endOffset;
    this.updateAvailability(false);
  }
  endReset() {
    this.sampleRequest.endOffset = 0;
    this.updateAvailability(false);
  }

  @computedFrom('startCalendar.calendarMonths[0].monthNumber', 'sampleRequest.startMonth')
  get computedClass() {
    if (this.startCalendar.calendarMonths[0].monthNumber == this.sampleRequest.startMonth) return true
  }

  @computedFrom('endCalendar.calendarMonths[0].monthNumber', 'sampleRequest.endMonth')
  get computedClassEnd() {
    if (this.endCalendar.calendarMonths[0].monthNumber == this.sampleRequest.endMonth) return true
  }


  get aSampleHasOutReason() {
    for (let i = 0; i < this.currentItem.samples.length; i++) {
      let sample = this.currentItem.samples[i];
      if (sample.outReason) {
        if (sample.outReason.id != 0) {
            if (this.sampleRequest.searchableItemsProposed.includes(sample.id)) { //console.log (" found an outReason"); 
              return true}
        } 
      }
    }
    //console.log (" no outReason"); 
    return false
  }

  
  bookOut() {
    // initiate stuart booking
    if (!(this.sampleRequest.pickupDate) ||
      !(this.sampleRequest.pickupTime) ||
      !(this.sampleRequest.addressDestination)) {
      this.alertP("Please pick a Date and Time and Address");
      return
    }
    this.busy.on();
    console.log("Initiate Stuart booking from editSampleRequest Out");
    document.getElementById('bookOut').style.visibility = 'hidden';
    this.sampleRequestService.bookOutSampleRequest(this.sampleRequest).then(sr => {
      this.sampleRequestService.getSampleRequest(this.sampleRequest.id).then(sampleRequest => {
        this.sampleRequest = sampleRequest;
        this.busy.off();
        this.alertP(sr.message);
        if(this.sampleRequest.shippingOut.stuartJobId == undefined)
          document.getElementById('bookOut').style.visibility = 'visible';
      });
    });

  }

  bookReturn() {
    // initiate stuart booking
    if (!(this.sampleRequest.pickupDateReturn) || !(this.sampleRequest.pickupTimeReturn)) {
      this.alertP("Please pick a Date and Time");
      return
    }
    this.busy.on();
    document.getElementById('bookReturn').style.visibility = 'hidden';
    console.log("Initiate Stuart booking from editSampleRequest Return");
    this.sampleRequestService.bookReturnSampleRequest(this.sampleRequest).then(sr => {
      this.sampleRequestService.getSampleRequest(this.sampleRequest.id).then(sampleRequest => {
        this.sampleRequest = sampleRequest;
        this.busy.off();
        this.alertP(sr.message);

        if(this.sampleRequest.shippingReturn.stuartJobId == undefined)
          document.getElementById('bookReturn').style.visibility = 'visible';
      });
    });
  }


  saveTrolley(){
    return this.sampleRequestService.saveTrolley(this.sampleRequest);
  }

  updateAvailability(clear = true) {
    console.log ("updateAvailability called");
    // clear dates as they may no longer be valid for the range
    if (clear) {
      this.sampleRequest.startDay = '';
      this.sampleRequest.startDate = '';
      this.sampleRequest.startMonth = '';
      this.sampleRequest.startDay = ''; 
      //  end date
      this.sampleRequest.endDay = '';
      this.sampleRequest.endDate = '';
      this.sampleRequest.endDay = '';
      this.sampleRequest.endMonth = '';
    } 

    var queryString = DateFormat.urlString(this.sampleRequest.endOffset, 1) + '&searchType=brand';
    this.http.fetch('/calendar/showAvailabilityTrolley' + queryString, {
      method: 'post',
      body: json(this.currentItem.samples)
    })
      .then(response => response.json())
      .then(calendar => {
        this.endCalendar = calendar;
      });

    queryString = DateFormat.urlString(this.sampleRequest.startOffset, 1) + '&searchType=brand';
    this.http.fetch('/calendar/showAvailabilityTrolley' + queryString, {
      method: 'post',
      body: json(this.currentItem.samples)
    })
      .then(response => response.json())
      .then(calendar => {
        this.startCalendar = calendar;
      });
  }


  // BUTTONS
  dates(){
    if(this.sampleRequest.startDate && this.sampleRequest.endDate){
      this.sampleRequest.datesSaved = true;
      this.saveTrolley().then(sr => {

        this.sampleRequest.id = sr.id;
        console.log("samplerequest id:"+this.sampleRequest.id);
        this.checkAvailabilty(this.currentItem);
        this.alertP("Dates Set").then(result => {
          $("#saveDates").toggle();
        });

      });
    } else{
      this.alertP("Dates have not been Set");
    }
  }

  cancel(){
    this.sampleRequestService.cancelCurrentSampleRequest();
    this.controller.close();
  }

  cancelKeepSR(id){
    let sampleRequest = this.sampleRequest;
    this.currentItem.samples.forEach(function (sample) {
      let inTrolley = sampleRequest.searchableItemsProposed.indexOf(item => {return sample.id === item});

      if(inTrolley){
          sampleRequest.searchableItemsProposed.splice(inTrolley,1);  
      }
          
     }); 
    
    this.sampleRequestService.sampleRequestStatus = 'created';
    this.sampleRequestService.getSampleRequest(id)
      .then(result =>{
          //this.alertP("Picking For "+id)
      });
    this.controller.close();
  }



  // While picking this saves the updated items in the trolley
  continue() {
    this.saveTrolley();
    this.controller.close();
  }



  // save address information, etc.
  submit(){
    this.sampleRequest.requestStatusBrand = "Approved"
    this.sampleRequestService.updateTrolley(this.sampleRequest)
      .then(result =>{
        this.alertP("Booking "+ this.sampleRequest.id + " Updated")
          .then(this.controller.close());
      });
  }

  save(){
    this.sampleRequestService.updateTrolley(this.sampleRequest)
      .then(result =>{
        this.alertP("Booking "+ this.sampleRequest.id + " Updated")
          .then(this.controller.close());
      });
  }



}