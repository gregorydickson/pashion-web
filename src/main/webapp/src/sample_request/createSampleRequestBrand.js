import {DialogController} from 'aurelia-dialog';
import {HttpClient,json} from 'aurelia-fetch-client';
import 'fetch';
import {inject} from 'aurelia-framework';
import {DateFormat} from 'common/dateFormat';
import { BrandService } from 'services/brandService';
import {CreateDialogNewAddress} from './dialogNewAddress';
import {DialogService} from 'aurelia-dialog';

@inject(HttpClient, DialogController, BrandService, DialogService)
export class CreateSampleRequestBrand {
  static inject = [DialogController];
  currentItem = {};
  startCalendar = {};
  endCalendar = {};

  selectAll = true;
  required = [];
  deliverTo = [];
  brand = [];
  brandAddresses = [];
  returnBy = [];
  returnTo = [];
  courier = [];
  payment = [];
  newAddress = [];


  sampleRequest = {};
  startOffset = 0;
  endOffset = 0;

  startDay = '';
  endDay = '';



  constructor(http, controller, brandService, dialogService){
    this.controller = controller;

    http.configure(config => {
      config
        .useStandardConfiguration();
    });
    this.http = http;
    this.brandService = brandService;
    this.dialogService = dialogService;
  }

  activate(itemId){

    var queryString = DateFormat.urlString(0, 2);
    this.http.fetch('/calendar/searchableItemPicker' +queryString+ '&item='+itemId)
      .then(response => response.json())
        .then(calendar => {
              this.startCalendar = calendar;
              this.endCalendar = calendar;
          });
    
    this.http.fetch('/searchableItems/'+itemId+'.json')
      .then(response => response.json())
      .then(item => {
          this.currentItem = item;   

         /* this.http.fetch('/brand/addresses/'+item.brand.id)
              .then(response => response.json())
              .then(addresses => this.brandAddresses = addresses); */

          this.brandService.getBrandAddresses(item.brand.id).then(addresses => this.brandAddresses = addresses);
          this.brandService.getBrand(item.brand.id).then(brand => this.brand = brand);
          this.sampleRequest.samples = [];
          var ids = this.sampleRequest.samples;
          item.samples.forEach(function(item){
            ids.push(item.id);
          })
          
        }
      )
      
    this.http.fetch('/dashboard/required').then(response => response.json()).then(required => this.required = required);
    this.http.fetch('/dashboard/deliverTo').then(response => response.json()).then(deliverTo => this.deliverTo = deliverTo);
    this.http.fetch('/dashboard/returnBy').then(response => response.json()).then(returnBy => this.returnBy = returnBy);
    this.http.fetch('/dashboard/courier').then(response => response.json()).then(courier => this.courier = courier);
    this.http.fetch('/dashboard/returnTo').then(response => response.json()).then(returnTo => this.returnTo = returnTo);
    this.http.fetch('/dashboard/payment').then(response => response.json()).then(payment => this.payment = payment);
   // this.http.fetch('/dashboard/seasons').then(response => response.json()).then(seasons => this.seasons = seasons);

   this.sampleRequest["returnToAddress"] = 0; // defualt return to sender
  }

  attached(){
    document.getElementById("CreateSampleRequestButton").disabled = true;
  }

  addAdHoc () {
    console.log ("STUBBED");

    this.dialogService.open({viewModel: CreateDialogNewAddress, model: this.newAddress })
      .then(response => {});

/* template from admin New office dialog
  CreateDialogNewOffice(user) {
    this.dialogService.open({viewModel: CreateDialogNewOffice, model: this.user })
      .then(response => {
        if (this.user.brand.id != null){
            this.brandService.getBrandAddresses(this.user.brand.id)
                .then(addresses=>{this.addresses = addresses})
        } else if(this.user.pressHouse.id != null){
            this.pressHouseService.getPressHouseAddresses(this.user.pressHouse.id)
                .then(addresses=>this.addresses = addresses)
        } else if(this.user.prAgency.id != null){
            this.prAgencyService.getPRAgencyAddresses(this.user.prAgency.id)
                .then(addresses=>this.addresses = addresses)
        }
      })
  } */

  }

  setStartDate(event,day){
    console.log("set start date: "+event);
    console.log("day: "+day);

    var today = new Date();
    this.startDay = day;
    let enddate = new Date(this.endCalendar.calendarMonths[0].year,this.endCalendar.calendarMonths[0].monthNumber,this.endDay)
    let startdate = new Date(this.startCalendar.calendarMonths[0].year,this.startCalendar.calendarMonths[0].monthNumber,day)

    // quit if in the past
    // could also add in here, any business logic about if we want to book +1 day out?

    console.log("today: " + today);
    console.log("startdate: " + startdate);
    console.log("enddate: " + enddate);
    if (startdate <= today) { console.log ("day is before today or is today"); return; }
    console.log ("day is in the future");
    
    if(this.endDay != ''){
      console.log("setting start date END DATE not empty");
      if( enddate < startdate ){
        console.log("setting start date AND it is after end date");
        this.endDay = ''
        let element = event.srcElement.parentElement;
        let document = element.ownerDocument;
        let elems = document.querySelectorAll(".end-selected");
        var redraw = this.redraw;
        [].forEach.call(elems, function(el) {
          if(el.classList.contains("end-selected")){
            el.classList.remove("end-selected");
            redraw(el);
          }
        });
      }
    }
    var element = event.srcElement.parentElement;
    var document = element.ownerDocument;
    var elems = document.querySelectorAll(".start-selected");
    [].forEach.call(elems, function(el) {
      el.classList.remove("start-selected");
    });
    element.className += " start-selected";
    this.redraw(element);
    this.sampleRequest.startDate = this.startCalendar.calendarMonths[0].year+"-"+this.startCalendar.calendarMonths[0].monthNumber+"-"+day;
    this.enableCheck();
  }

  setEndDate(event, day){
    this.endDay = day;
    let enddate = new Date(this.endCalendar.calendarMonths[0].year,this.endCalendar.calendarMonths[0].monthNumber,day)
    let startdate = new Date(this.startCalendar.calendarMonths[0].year,this.startCalendar.calendarMonths[0].monthNumber,this.startDay)
    var today = new Date();

    console.log("today: " + today);
    console.log("startdate: " + startdate);
    console.log("enddate: " + enddate);
    if (enddate <= today) { console.log ("day is before today or is today"); return; }
    console.log ("day is in the future");

    if(this.startDay === '' || enddate < startdate || enddate.getTime() == startdate.getTime()){
      return
    }
    
    console.log("end date"+event);
    console.log("day"+day);
    let element = event.srcElement.parentElement;
    let document = element.ownerDocument;
    let elems = document.querySelectorAll(".end-selected");
    [].forEach.call(elems, function(el) {
      el.classList.remove("end-selected");
    });
    element.className += " end-selected";
    this.redraw(element);
    this.sampleRequest.endDate = this.endCalendar.calendarMonths[0].year+"-"+this.endCalendar.calendarMonths[0].monthNumber+"-"+day;
    this.enableCheck();
    
  }

  enableCheck(){
    
    if((this.sampleRequest.samples === undefined) ||
       (this.sampleRequest.samples.length == 0) ||
       (this.sampleRequest.startDate === undefined) ||
       (this.sampleRequest.startDate == '') ||
       (this.sampleRequest.endDate === undefined) ||
       (this.sampleRequest.endDate == '')){
          document.getElementById("CreateSampleRequestButton").disabled = true;
          console.log("button DIS abled");
    } else{
      document.getElementById("CreateSampleRequestButton").disabled = false; 
      console.log("button ENabled");
    }
  }
  

  redraw(element){
    element.style.display='none';
    element.offsetHeight; 
    element.style.display='';
  }
  startNext(){
    var queryString = DateFormat.urlString(++this.startOffset,1);
    return this.http.fetch('/calendar/searchableItemPicker' + queryString+
                 '&item='+this.currentItem.id)
          .then(response => response.json())
          .then(calendar => {
              this.startCalendar = calendar;
          })

  }
  startPrevious(){
    var queryString = DateFormat.urlString(--this.startOffset,1);
    return this.http.fetch('/calendar/searchableItemPicker' +queryString+
                 '&item='+this.currentItem.id)
          .then(response => response.json())
          .then(calendar => {
              this.startCalendar = calendar;
          })

  }
  startReset(){
    var queryString = DateFormat.urlString(0,1);
    return this.http.fetch('/calendar/searchableItemPicker' + queryString+
                 '&item='+this.currentItem.id)
          .then(response => response.json())
          .then(calendar => {
              this.startCalendar = calendar;
          })

  }

  endNext(){
    var queryString = DateFormat.urlString(++this.endOffset,1);
    return this.http.fetch('/calendar/searchableItemPicker' + queryString+
                 '&item='+this.currentItem.id)
          .then(response => response.json())
          .then(calendar => {
              this.endCalendar = calendar;
          })

  }
  endPrevious(){
    var queryString = DateFormat.urlString(--this.endOffset,1);
    return this.http.fetch('/calendar/searchableItemPicker' +queryString+
                 '&item='+this.currentItem.id)
          .then(response => response.json())
          .then(calendar => {
              this.endCalendar = calendar;
          });

  }
  endReset(){
    var queryString = DateFormat.urlString(0,1);
    return this.http.fetch('/calendar/searchableItemPicker' + queryString+
                 '&item='+this.currentItem.id)
          .then(response => response.json())
          .then(calendar => {
              this.endCalendar = calendar;
          });
  }

  allsamples(event){
    console.log("all samples"+event.srcElement.checked);
    if(event.srcElement.checked) {
      for (var i = 0, len = this.currentItem.samples.length; i < len; i++) {
        if(!(this.sampleRequest.samples.includes(this.currentItem.samples[i].id))){
          this.sampleRequest.samples.push(this.currentItem.samples[i].id);
        }
      }
      
    }else{
      this.sampleRequest.samples = [];
      document.getElementById("CreateSampleRequestButton").disabled = true;  
    }
  }


  updateAvailability(){
    this.allSamplesSelected();
    if(this.sampleRequest.samples.length == 0) {
      console.log("no samples");
      document.getElementById("CreateSampleRequestButton").disabled = true;
    } else {

      var queryString = DateFormat.urlString(this.endOffset,1);
      this.http.fetch('/calendar/showAvailabilityLookAndSamples'+queryString, {
              method: 'post',
              body: json(this.sampleRequest.samples)
            })
            .then(response => response.json())
            .then(calendar => {
                this.endCalendar = calendar;
            });

      queryString = DateFormat.urlString(this.startOffset,1);
      this.http.fetch('/calendar/showAvailabilityLookAndSamples'+queryString, {
              method: 'post',
              body: json(this.sampleRequest.samples)
            })
            .then(response => response.json())
            .then(calendar => {
                this.startCalendar = calendar;
            });
    }
    
  }

  allSamplesSelected() {
    let samplesSelected = this.sampleRequest.samples;
    let samples = this.currentItem.samples;

    if (samples.length != samplesSelected.length) {
      this.selectAll = false;
      console.log("length not equal");
      return;
    } else {
      this.selectAll = true;
    }
    this.enableCheck();
  }

  submit(){
    // var payload = json(this.sampleRequest);
    console.log("submitting Sample Request: " + JSON.stringify(this.sampleRequest));
    this.http.fetch('/sampleRequest/savejson', {
            method: 'post',
            body: json(this.sampleRequest)
          })
          .then(response => response.json())
          .then(result => {
              this.result = result;
              alert('Request Sent');
              this.controller.close();

          });
    
  }

  close(){
    this.controller.close();
  }

}