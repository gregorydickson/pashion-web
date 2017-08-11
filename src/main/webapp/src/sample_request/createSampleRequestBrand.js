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



@inject(HttpClient, DialogController, BrandService, DialogService, UserService, OutReasonService, PRAgencyService,SampleRequestService)
export class CreateSampleRequestBrand {
  static inject = [DialogController];
  
  currentItem = null;
  startCalendar = null;
  endCalendar = null;
  isLoading = true;

  selectAll = true;
  required = [];

  availableReturnToItems = [];
  selectedReturnToItems = [''];
  sampleRequestStartMonth = '';
  sampleRequestStartDay = '';
  sampleRequestEndMonth = '';
  sampleRequestEndDay = '';

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
  startOffset = 0;
  endOffset = 0;

  startDay = '';
  endDay = '';

  constructor(http, controller, brandService, dialogService,userService, outReasonService, PRAgencyService,sampleRequestService) {
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
  }


  activate(item) {
    var queryString = DateFormat.urlString(0, 2) + '&searchType=brand';

    this.sampleRequest = this.sampleRequestService.getCurrentSampleRequest();
    

    if(this.sampleRequest.startFinalize){
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
        this.http.fetch('/dashboard/payment').then(response => response.json()).then(payment => {
          this.payment = payment;
        })
          
      ])
    } else{
      return Promise.all([
        this.userService.getUser().then(user => {this.user = user}),
        this.http.fetch('/calendar/searchableItemPicker' + queryString + '&item=' + item.id)
          .then(response => response.json())
          .then(calendar => {
            this.startCalendar = calendar;
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
            this.brandService.getBrand(item.brand.id).then(brand => {this.brand = brand});
          })
      ])
    }
  }


  attached() {
    this.isLoading = false;
    if(this.currentItem)
      this.checkSamples();
    ga('set', 'page', '/createSampleRequestBrand.html');
    ga('send', 'pageview');
  }

  addressInit(){
    let defaultAddress = this.returnTo.find(item => item.defaultAddress == true);
    if (defaultAddress) {
      let availableReturnToItems = this.availableReturnToItems;
      let selectedReturnTo = availableReturnToItems.find(item => item.id == defaultAddress.id);
      this.sampleRequest.returnToAddress = selectedReturnTo.id;
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

        var ids = this.sampleRequest.samples;
        this.currentItem.samples.forEach(function (item,index,object) {
          if(result){
            if(item.sampleCity.name == theUser.city.name ){
              ids.push(item.id);
            } else {
              console.log("not adding to selected");
            }
          } else {
            ids.push(item.id);
          }
          
        })

      });
    }
    if (user.type=="prAgency"){
      this.prAgencyService.getRestrictOutsideBooking(this.user.prAgency.id).then(result =>{ 
        console.log("restrict Outside booking:"+result)
        this.restrictOutsideBooking = result;
        var theUser = this.user;

        var ids = this.sampleRequest.samples;
        this.currentItem.samples.forEach(function (item,index,object) {
          if(result){
            if(item.sampleCity.name == theUser.city.name ){
              ids.push(item.id);
            } 
          } else {
            ids.push(item.id);
          }
          
        })
      });
    }
  }

  onSelectAddressChangeCallback(event) {
    console.log('onSelectAddressChangeCallback() called:', event.detail.value);
    if (event.detail.value.selectedAddress) {
      this.selectedAddress = event.detail.value.selectedAddress;
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

    this.startDay = day;
    var enddate = '';
    if (this.endDay != '') enddate = new Date(this.endCalendar.calendarMonths[0].year, this.endCalendar.calendarMonths[0].monthNumber - 1, this.endDay);
    let startdate = new Date(this.startCalendar.calendarMonths[0].year, this.startCalendar.calendarMonths[0].monthNumber - 1, day);

    // quit if in the past
    // could also add in here, any business logic about if we want to book +1 day out?
    console.log("today: " + today);
    console.log("startdate: " + startdate);
    console.log("startDay: " + this.startDay);
    if (this.endDay != '') console.log("enddate: " + enddate); else console.log("no endDay set")
    console.log("endDay: " + this.endDay);
    if (startdate.getTime() <= yesterday) {
      console.log("day is before today.");
      this.startDay = '';
      this.sampleRequest.startDate = '';
      this.sampleRequestStartMonth = '';
      this.sampleRequestStartDay = '';
      // also clear end date
      this.endDay = '';
      this.sampleRequest.endDate = '';
      this.sampleRequestEndDay = '';
      this.sampleRequestEndMonth = '';
      
      return;
    }
    console.log("day is in the future");
    
    this.sampleRequest.startDate = this.startCalendar.calendarMonths[0].year + "-" + this.startCalendar.calendarMonths[0].monthNumber + "-" + day;
    this.sampleRequestStartMonth = this.startCalendar.calendarMonths[0].monthNumber;
    this.sampleRequestStartDay = day;
  }

  setEndDate(event, dayEvent, day) {
    if(this.sampleRequest.datesSaved){
      console.log("dates already saved returning");
      return;
    }
    this.endDay = day;
    var startdate = '';
    let enddate = new Date(this.endCalendar.calendarMonths[0].year, this.endCalendar.calendarMonths[0].monthNumber - 1, day);
    if (this.startDay != '') startdate = new Date(this.startCalendar.calendarMonths[0].year, this.startCalendar.calendarMonths[0].monthNumber - 1, this.startDay);
    var today = new Date();    
    var yesterday = 0;
    var todayMilli = today.getTime();
    yesterday = todayMilli - (24*60*60*1000);

    console.log("today: " + today);
    if (this.startDay != '') console.log("startDay: " + this.startDay);
    else {
      console.log("no startDay set, exit");
      this.endDay = '';
      this.sampleRequest.endDate = '';
      this.sampleRequestEndDay = '';
      this.sampleRequestEndMonth = '';
      return;
    }
    console.log("startdate: " + startdate);
    console.log("enddate: " + enddate);
    console.log("endDay: " + this.endDay);
    if (enddate.getTime() <= yesterday) {
      console.log("day is before today.");
      this.endDay = '';
      this.sampleRequest.endDate = '';
      this.sampleRequestEndDay = '';
      this.sampleRequestEndMonth = '';
      return;
    }
    console.log("day is in the future");

    if (this.startDay === '' || enddate < startdate ) {
      console.log(" empty, reverse ");
      this.endDay = '';
      this.sampleRequest.endDate = '';
      this.sampleRequestEndDay = '';
      this.sampleRequestEndMonth = '';
      return;
    }
    console.log("end date" + event);
    console.log("day" + day);
    
    this.sampleRequest.endDate = this.endCalendar.calendarMonths[0].year + "-" + this.endCalendar.calendarMonths[0].monthNumber + "-" + day;
    this.sampleRequestEndMonth = this.endCalendar.calendarMonths[0].monthNumber;
    this.sampleRequestEndDay = day;
  }

  dates(){
    if(this.sampleRequest.startDate && this.sampleRequest.endDate){
      this.sampleRequest.datesSaved = true;
      this.alertP("Dates Set").then(result => {
        $("#saveDates").toggle();
      });
      
    } else{
      this.alertP("Dates have not been Set");
    }
  }

  addSample(sample){
    let already = this.sampleRequest.samples.find(item => {return sample.id === item.id});
    if(already){
      this.alertP("Sample Already In Request")
    } else{
      this.sampleRequest.samples.push(sample);
    }
    
  }

  submitCheck() {

    if ((this.sampleRequest.samples === undefined) ||
      (this.sampleRequest.samples.length == 0) ||
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
    ++this.startOffset;
  }
  startPrevious() {
    --this.startOffset;
  }
  startReset() {
    this.startOffset = 0;
  }
  endNext() {
    ++this.endOffset;
  }
  endPrevious() {
    --this.endOffset;
  }
  endReset() {
    this.endOffset = 0;
  }

  @computedFrom('startCalendar.calendarMonths[0].monthNumber', 'sampleRequestStartMonth')
  get computedClass() {
    if (this.startCalendar.calendarMonths[0].monthNumber == this.sampleRequestStartMonth) return true
  }

  @computedFrom('endCalendar.calendarMonths[0].monthNumber', 'sampleRequestEndMonth')
  get computedClassEnd() {
    if (this.endCalendar.calendarMonths[0].monthNumber == this.sampleRequestEndMonth) return true
  }


  get aSampleHasOutReason() {
    for (let i = 0; i < this.currentItem.samples.length; i++) {
      let sample = this.currentItem.samples[i];
      if (sample.outReason) {
        if (sample.outReason.id != 0) {
            if (this.sampleRequest.samples.includes(sample.id)) { //console.log (" found an outReason"); 
              return true}
        } 
      }
    }
    //console.log (" no outReason"); 
    return false
  }


  prepareToSave() {
    if(this.selectedAddress)
      this.sampleRequest.deliverTo = this.selectedAddress;
    if (this.user.type=="prAgency"){
      this.sampleRequest["prAgency"] = this.user.prAgency.id
    }
  }

  cancel(){
    this.sampleRequestService.cancelCurrentSampleRequest();
    this.controller.close();
  }

  close() {
    this.controller.close();
  }

}