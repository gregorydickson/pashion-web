import {DialogController} from 'aurelia-dialog';
import {HttpClient,json} from 'aurelia-fetch-client';
import 'fetch';
import {inject} from 'aurelia-framework';
import {DateFormat} from 'common/dateFormat';

@inject(HttpClient, DialogController)
export class CreateSampleRequest {
  static inject = [DialogController];
  currentItem = {};
  startCalendar = {};
  endCalendar = {};
  selectedProductIds = [];
  selectAll = true;
  required = [];
  deliverTo = [];
  brandAddresses = [];
  returnBy = [];
  returnTo = [];
  courier = [];
  payment = [];


  sampleRequest = {};
  startOffset = 0;
  endOffset = 0;



  constructor(http, controller){
    this.controller = controller;

    http.configure(config => {
      config
        .useStandardConfiguration();
    });
    this.http = http;
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
          this.http.fetch('/brand/addresses/'+item.brand.id)
              .then(response => response.json())
              .then(addresses => this.brandAddresses = addresses);
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
  }

  setStartDate(event,day){
  	console.log("start date"+event);
  	console.log("day"+day);
  	var element = event.srcElement.parentElement;
  	var document = element.ownerDocument;
  	var elems = document.querySelectorAll(".start-selected");
  	[].forEach.call(elems, function(el) {
    	el.classList.remove("start-selected");
	  });
  	element.className += " start-selected";
  	this.redraw(element);
  	this.sampleRequest.startDate = this.startCalendar.calendarMonths[0].year+"-"+this.startCalendar.calendarMonths[0].monthNumber+"-"+day;

  }
  setEndDate(event, day){
  	console.log("end date"+event);
  	console.log("day"+day);
  	var element = event.srcElement.parentElement;
  	var document = element.ownerDocument;
  	var elems = document.querySelectorAll(".end-selected");
  	[].forEach.call(elems, function(el) {
    	el.classList.remove("end-selected");
	  });
  	element.className += " end-selected";
  	this.redraw(element);
    this.sampleRequest.endDate = this.endCalendar.calendarMonths[0].year+"-"+this.endCalendar.calendarMonths[0].monthNumber+"-"+day;
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

    if(this.checked) {
     
    }else{
      for (var i = 0, len = this.currentItem.samples.length; i < len; i++) {
        if(!(this.sampleRequest.samples.includes(this.currentItem.samples[i].id))){
          this.sampleRequest.samples.push(this.currentItem.samples[i].id);
        }
      }
      this.updateAvailability();
    }
    
    
  }


  updateAvailability(){

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

  address(){

  }

  submit(){
    console.log("submitting Sample Request");
    this.sampleRequest.samples = this.selectedProductIds;
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