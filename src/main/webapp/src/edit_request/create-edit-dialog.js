import {DialogController} from 'aurelia-dialog';
import {HttpClient} from 'aurelia-fetch-client';
import 'fetch';
import {inject} from 'aurelia-framework';
import {DateFormat} from 'common/dateFormat';

@inject(HttpClient, DialogController)
export class CreateEditDialog {
  static inject = [DialogController];
  currentItem = {};
  startCalendar = {};
  endCalendar = {};
  startOffset = 0;
  endOffset = 0;
  startDate = "";
  endDate = "";

  constructor(http, controller){
    this.controller = controller;
    http.configure(config => {
      config
        .useStandardConfiguration();
    });
    this.http = http;
  }
  activate(itemId){
  	this.http.fetch('/searchableItems/' +itemId+ '.json')
      .then(response => response.json()).then(item => this.currentItem = item);

    var queryString = DateFormat.urlString(0, 2);
    this.http.fetch('/calendar/searchableItemPicker' +queryString+ '&item='+itemId)
    	.then(response => response.json())
        .then(calendar => {
              this.startCalendar = calendar;
              this.endCalendar = calendar;
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
  	this.startDate = day;

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
  	this.endDate = day;
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
          })

  }
  endReset(){
  	var queryString = DateFormat.urlString(0,1);
    return this.http.fetch('/calendar/searchableItemPicker' + queryString+
    					   '&item='+this.currentItem.id)
          .then(response => response.json())
          .then(calendar => {
              this.endCalendar = calendar;
          })

  }
}