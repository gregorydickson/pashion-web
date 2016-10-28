import {DialogController} from 'aurelia-dialog';
import {HttpClient,json} from 'aurelia-fetch-client';
import 'fetch';
import {inject} from 'aurelia-framework';
import {DateFormat} from 'common/dateFormat';

@inject(HttpClient, DialogController)
export class CheckAvailability {
  static inject = [DialogController];
  
  currentItem = {};
  calendar = {};
  offset = 0;

  startDate = "";
  currentSample = {};



  

  constructor(http, controller){
    this.controller = controller;
    
    http.configure(config => {
      config
        .useStandardConfiguration();
    });
    this.http = http;
  }

  activate(itemId){
    this.http.fetch('/searchableItems/'+itemId+'.json')
      .then(response => response.json())
      .then(item => {
          this.currentItem = item;
    });


    var queryString = DateFormat.urlString(0, 1);
    this.http.fetch('/calendar/datePickerNoAvailability' +queryString)
    	.then(response => response.json())
      .then(calendar => {
              this.calendar = calendar;
    });

    
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
  	this.startDate = this.calendar.calendarMonths[0].year+"-"+this.calendar.calendarMonths[0].monthNumber+"-"+day;

  }
  

  redraw(element){
    element.style.display='none';
    element.offsetHeight; 
	  element.style.display='';
  }
  next(){
  	var queryString = DateFormat.urlString(++this.offset,1);
    return this.http.fetch('/calendar/datePickerNoAvailability' + queryString)
          .then(response => response.json())
          .then(calendar => {
              this.calendar = calendar;
          })
  }

  previous(){
  	var queryString = DateFormat.urlString(--this.offset,1);
    return this.http.fetch('/calendar/datePickerNoAvailability' +queryString)
          .then(response => response.json())
          .then(calendar => {
              this.calendar = calendar;
          })
  }

  reset(){
  	var queryString = DateFormat.urlString(0,1);
    return this.http.fetch('/calendar/datePickerNoAvailability' + queryString)
          .then(response => response.json())
          .then(calendar => {
              this.calendar = calendar;
          })
  }

  
 

  submit(){
    console.log("submitting Availability Data");
    var item = this.curentItem;
    
    this.http.fetch('/searchableItem/savejson', {
            method: 'post',
            body: json(item)
          })
          .then(response => response.json())
          .then(result => {
              this.result = result;
          });
    this.currentItem.id = this.result;
    alert('Image Updated');
    this.controller.close();
    
  }


}