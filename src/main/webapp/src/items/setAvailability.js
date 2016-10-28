import {DialogController} from 'aurelia-dialog';
import {HttpClient,json} from 'aurelia-fetch-client';
import 'fetch';
import {inject} from 'aurelia-framework';
import {DateFormat} from 'common/dateFormat';

@inject(HttpClient, DialogController)
export class SetAvailability {
  static inject = [DialogController];
  
  currentItem = {};
  calendar = {};
  offset = 0;

  
 



  

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

  	var element = event.srcElement.parentElement;
  	var document = element.ownerDocument;
  	var elems = document.querySelectorAll(".start-selected");
  	[].forEach.call(elems, function(el) {
    	el.classList.remove("start-selected");
	  });
  	element.className += " start-selected";
  	this.redraw(element);
  	this.currentItem.fromDate = this.calendar.calendarMonths[0].year+"-"+this.calendar.calendarMonths[0].monthNumber+"-"+day;

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

  
  cancel(){
    this.controller.close();
  }

  submit(){
    console.log("submitting Availability Data");

    var item = this.currentItem;
    console.log("item:"+item);
    
    this.http.fetch('/searchableItem/saveFromDate', {
            method: 'post',
            body: json(item)
          })
          .then(response => response.json())
          .then(result => {
              this.result = result;
          });
    this.currentItem.id = this.result;
    alert('Start Date Updated');
    this.controller.close();
    
  }


}