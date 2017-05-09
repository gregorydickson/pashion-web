import {DialogController} from 'aurelia-dialog';
import {HttpClient,json} from 'aurelia-fetch-client';
import 'fetch';
import {inject} from 'aurelia-framework';
import {DateFormat} from 'common/dateFormat';
import { BrandService } from 'services/brandService';
import { CreateDialogAlert } from 'common/dialogAlert';
import {DialogService} from 'aurelia-dialog';
import {computedFrom} from 'aurelia-framework';

@inject(HttpClient, DialogController, BrandService ,DialogService)
export class CreateSampleRequestPress {
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
 // seasons = [];
  sampleRequestStartMonth = '';
  sampleRequestStartDay = '';
  sampleRequestEndMonth = '';
  sampleRequestEndDay = '';


  sampleRequest = {requiredBy:"12:00", courierOut:"They Book",paymentOut:"50/50", returnBy:"Afternoon",courierReturn:"Pashion Courier",paymentReturn:"50/50"};
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
    this.http.fetch('/dashboard/seasons').then(response => response.json()).then(seasons => this.seasons = seasons);
   // this.http.fetch('/dashboard/seasons').then(response => response.json()).then(seasons => this.seasons = seasons);
   this.sampleRequest["returnToAddress"] = 0; // defualt return to sender
  }

  attached(){
    document.getElementById("CreateSampleRequestButton").disabled = true;
  }

  alertP (message){

        this.dialogService.open({ viewModel: CreateDialogAlert, model: {title:"Booking", message:message, timeout:5000}, lock:false }).then(response => {});
    }

  setStartDate(event,dayEvent,day){
    console.log("set start date: "+event);
    console.log("parameterday: "+day);

    var today = new Date();
    this.startDay = day;
    var enddate = '';
    if (this.endDay !='') enddate = new Date(this.endCalendar.calendarMonths[0].year,this.endCalendar.calendarMonths[0].monthNumber-1,this.endDay);
    let startdate = new Date(this.startCalendar.calendarMonths[0].year,this.startCalendar.calendarMonths[0].monthNumber-1,day);

    // quit if in the past
    // could also add in here, any business logic about if we want to book +1 day out?
    console.log("today: " + today);
    console.log("startdate: " + startdate);
    console.log("startDay: " + this.startDay);
    if (this.endDay !='') console.log("enddate: " + enddate); else console.log("no endDay set")
    console.log("endDay: " + this.endDay);
    if (startdate <= today) { 
      console.log ("day is before today or is today, exit"); 
      this.startDay = '';
      this.sampleRequest.startDate = '';
      this.sampleRequestStartMonth = '';
      this.sampleRequestStartDay = ''; 
      // also clear end date
      this.endDay = '';
      this.sampleRequest.endDate = '';
      this.sampleRequestEndDay = '';
      this.sampleRequestEndMonth = '';
      this.enableCheck();
      return; 
    }
    console.log ("day is in the future");

    //check availability
    var dayIsNotAvailable = dayEvent.indexOf("not-available")>=0;
    console.log ("setStartDate, calendar day contains unavailable: " + dayIsNotAvailable);
    if (dayIsNotAvailable) {
      this.startDay = '';
      this.sampleRequest.startDate = '';
      this.sampleRequestStartMonth = '';
      this.sampleRequestStartDay = '';
      // also clear end date
      this.endDay = '';
      this.sampleRequest.endDate = '';
      this.sampleRequestEndDay = '';
      this.sampleRequestEndMonth = ''; 
      this.enableCheck();
      return;  
    }
    
    if(this.endDay != ''){
      console.log("setting start date END DATE not empty");
      if( enddate < startdate ){
        console.log("setting start date AND it is after end date");
        this.endDay = '';
        this.sampleRequest.endDate = '';
        this.sampleRequestEndDay = '';
        this.sampleRequestEndMonth = '';
        this.enableCheck();
        //let element = event.srcElement.parentElement;
        //let document = element.ownerDocument;
        //let elems = document.querySelectorAll(".end-selected");
        //var redraw = this.redraw;
        //[].forEach.call(elems, function(el) {
          //if(el.classList.contains("end-selected")){
         //   el.classList.remove("end-selected");
          //  redraw(el);
         // }
        //});
      }
    }
    //var element = event.srcElement.parentElement;
    //var document = element.ownerDocument;
    //var elems = document.querySelectorAll(".start-selected");
    //this.sampleRequestStartMonth = '';
    //this.sampleRequestStartDay = '';
    //[].forEach.call(elems, function(el) {
     // el.classList.remove("start-selected");
    //});
    //element.className += " start-selected";
    //this.redraw(element);
    this.sampleRequest.startDate = this.startCalendar.calendarMonths[0].year+"-"+this.startCalendar.calendarMonths[0].monthNumber+"-"+day;
    this.sampleRequestStartMonth = this.startCalendar.calendarMonths[0].monthNumber;
    this.sampleRequestStartDay = day;
    this.enableCheck();
  }


  @computedFrom('startCalendar.calendarMonths[0].monthNumber', 'sampleRequestStartMonth')
  get computedClass () { 
    if (this.startCalendar.calendarMonths[0].monthNumber == this.sampleRequestStartMonth) return true
  }

 @computedFrom('endCalendar.calendarMonths[0].monthNumber', 'sampleRequestEndMonth')
  get computedClassEnd () { 
    if (this.endCalendar.calendarMonths[0].monthNumber == this.sampleRequestEndMonth) return true
  }

  setEndDate(event, dayEvent, day){
    this.endDay = day;
    var startdate = '';
    let enddate = new Date(this.endCalendar.calendarMonths[0].year,this.endCalendar.calendarMonths[0].monthNumber-1,day);
    if (this.startDay != '') startdate = new Date(this.startCalendar.calendarMonths[0].year,this.startCalendar.calendarMonths[0].monthNumber-1,this.startDay);
    var today = new Date();

    console.log("today: " + today);
    if (this.startDay != '') console.log("startDay: " + this.startDay); 
    else { 
      console.log("no startDay set, exit"); 
      this.endDay = '';
      this.sampleRequest.endDate = '';
      this.sampleRequestEndDay = '';
      this.sampleRequestEndMonth = '';
      this.enableCheck(); 
      return;
    }
    console.log("startdate: " + startdate); 
    console.log("enddate: " + enddate);
    console.log("endDay: " + this.endDay);
    if (enddate <= today) { 
      console.log ("day is before today or is today, exit"); 
      this.endDay = ''; 
      this.sampleRequest.endDate = '';
      this.sampleRequestEndDay = '';
      this.sampleRequestEndMonth = '';
      this.enableCheck();
      return; 
    }
    console.log ("day is in the future");

    if(this.startDay === '' || enddate < startdate || enddate.getTime() == startdate.getTime()){
      console.log (" empty, reverse or time clash");
      this.endDay = '';
      this.sampleRequest.endDate = '';
      this.sampleRequestEndDay = '';
      this.sampleRequestEndMonth = '';
      this.enableCheck();
      return;
    }

    //check availability
    var dayIsNotAvailable = dayEvent.indexOf("not-available")>=0;
    console.log ("setEndDate, calendar day contains unavailable: " + dayIsNotAvailable);
    if (dayIsNotAvailable) {
      this.endDay = '';
      this.sampleRequest.endDate = '';
      this.sampleRequestEndDay = '';
      this.sampleRequestEndMonth = ''; 
      this.enableCheck();
      return;  
    }
    
    console.log("end date"+event);
    console.log("day"+day);
    //let element = event.srcElement.parentElement;
    //let document = element.ownerDocument;
    //let elems = document.querySelectorAll(".end-selected");
    //[].forEach.call(elems, function(el) {
    //  el.classList.remove("end-selected");
    //});
    //element.className += " end-selected";
    //this.redraw(element);
    this.sampleRequest.endDate = this.endCalendar.calendarMonths[0].year+"-"+this.endCalendar.calendarMonths[0].monthNumber+"-"+day;
    this.sampleRequestEndMonth = this.endCalendar.calendarMonths[0].monthNumber;
    this.sampleRequestEndDay = day;
    this.enableCheck();
    
  }

  enableCheck(){
    
    if((this.sampleRequest.samples === undefined) ||
       (this.sampleRequest.samples.length == 0) ||
       (this.sampleRequest.startDate === undefined) ||
       (this.sampleRequest.startDate == '') ||
       (this.sampleRequest.endDate === undefined) ||
       (this.sampleRequest.deliverTo === undefined) ||
       (this.sampleRequest.returnToAddress === undefined) ||
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
  	++this.startOffset;
    this.updateAvailability();
  }
  startPrevious(){
  	--this.startOffset;
    this.updateAvailability();
  }
  startReset(){
    this.startOffset=0;
    this.updateAvailability();
  }
  endNext(){
  	++this.endOffset;
    this.updateAvailability();
  }
  endPrevious(){
  	--this.endOffset;
    this.updateAvailability();
  }
  endReset(){
    this.endOffset=0;
    this.updateAvailability();
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
    this.enableCheck();    
  }


  updateAvailability(){
    this.allSamplesSelected();
    if(this.sampleRequest.samples.length == 0) {
      console.log("no samples");
      document.getElementById("CreateSampleRequestButton").disabled = true;
    } else {

      var queryString = DateFormat.urlString(this.endOffset,1);
      this.http.fetch('/calendar/showAvailabilitySamples'+queryString, {
              method: 'post',
              body: json(this.sampleRequest.samples)
            })
            .then(response => response.json())
            .then(calendar => {
                this.endCalendar = calendar;
            });

      queryString = DateFormat.urlString(this.startOffset,1);
      this.http.fetch('/calendar/showAvailabilitySamples'+queryString, {
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
      // return;
    } else {
      this.selectAll = true;
    }
    this.enableCheck();
  }

  submit(){
    console.log("submitting Sample Request");
    this.http.fetch('/sampleRequest/savejson', {
            method: 'post',
            body: json(this.sampleRequest)
          })
          .then(response => response.json())
          .then(result => {
              this.result = result;
              this.alertP('Request Sent');
              this.controller.ok();

          });
    
  }

  close(){
    this.controller.close();
  }

}