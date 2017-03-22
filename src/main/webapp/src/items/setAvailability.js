import {DialogController} from 'aurelia-dialog';
import {HttpClient,json} from 'aurelia-fetch-client';
import 'fetch';
import {inject} from 'aurelia-framework';
import {DateFormat} from 'common/dateFormat';
import moment from 'moment';

@inject(HttpClient, DialogController)
export class SetAvailability {
  static inject = [DialogController];
  
  id = '';
  item = null;
  calendar = {};
  offset = 0;
  newDate = '';
  

  constructor(http, controller){
    this.controller = controller;
    
    http.configure(config => {
      config
        .useStandardConfiguration();
    });
    this.http = http;
  }

  activate(item){
    this.id = item.name;
    this.item = item;



    var queryString = DateFormat.urlString(0, 1);
    this.http.fetch('/calendar/pastNotAvailable' +queryString)
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
    //this.newDate = this.calendar.calendarMonths[0].year+"-"+this.calendar.calendarMonths[0].monthNumber+"-"+day;
    // needs to be in "dd-M-yy" format for external consumption
    //RM tested. but unsure if we need to propergate other format changes
    this.newDate = moment(day+"-"+this.calendar.calendarMonths[0].monthNumber+"-"+this.calendar.calendarMonths[0].year,"D-M-YYYY" ,false).format('DD-MMM-YYYY');


  }
  

  redraw(element){
    element.style.display='none';
    element.offsetHeight; 
	  element.style.display='';
  }
  next(){
  	var queryString = DateFormat.urlString(++this.offset,1);
    return this.http.fetch('/calendar/pastNotAvailable' + queryString)
          .then(response => response.json())
          .then(calendar => {
              this.calendar = calendar;
          })
  }

  previous(){
  	var queryString = DateFormat.urlString(--this.offset,1);
    return this.http.fetch('/calendar/pastNotAvailable' +queryString)
          .then(response => response.json())
          .then(calendar => {
              this.calendar = calendar;
          })
  }

  reset(){
  	var queryString = DateFormat.urlString(0,1);
    return this.http.fetch('/calendar/pastNotAvailable' + queryString)
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

    var update = {};
    update.fromDate = this.newDate;
    update.id = this.item.id;
    console.log("update:"+update.id + " " + update.fromDate);
    
    this.http.fetch('/searchableItem/saveFromDate', {
            method: 'post',
            body: json(update)
          })
          .then(response => response.json())
          .then(result => {
              this.result = result;
              this.controller.close();
          });
    
    
    
    
  }


}