import {DialogController} from 'aurelia-dialog';
import {HttpClient,json} from 'aurelia-fetch-client';
import 'fetch';
import {inject} from 'aurelia-framework';
import {DateFormat} from 'common/dateFormat';

@inject(HttpClient, DialogController)
export class EditSearchableItem {
  static inject = [DialogController];
  
  currentItem = {};
  result = {};

  itemTypes = [];
  sampleTypes = [];
  currentSample = {};
  colors = [];
  material = [];


  selectedSample = {};
  

  constructor(http, controller){
    this.controller = controller;
    
    http.configure(config => {
      config
        .useStandardConfiguration();
    });
    this.http = http;
  }

  activate(itemId){
    var queryString = DateFormat.urlString(0, 1);
    
    this.http.fetch('/dashboard/itemTypes').then(response => response.json()).then(itemTypes => this.itemTypes = itemTypes);
    this.http.fetch('/dashboard/sampleTypes').then(response => response.json()).then(sampleTypes => this.sampleTypes = sampleTypes);
    this.http.fetch('/dashboard/colors').then(response => response.json()).then(colors => this.colors = colors);
    this.http.fetch('/dashboard/material').then(response => response.json()).then(material => this.material = material);
    this.http.fetch('/searchableItem/fetchdeep/'+itemId+'.json')
      .then(response => response.json())
      .then(item => {
          this.currentItem = item;
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


  //RM necessary to do on cancel?
  reset(){
  	var queryString = DateFormat.urlString(0,1);
    return this.http.fetch('/calendar/datePickerNoAvailability' + queryString)
          .then(response => response.json())
          .then(calendar => {
              this.calendar = calendar;
          })
  }

  newsample(){
    
    var newsample = {};
    newsample.name = "NEW";
    newsample.description = "NEW";
    this.currentItem.samples.push(newsample)
    this.selectedSample = newsample
    
  }
 

  submit(){
    console.log("submitting Image Data");
    var item = this.currentItem;
    
    this.http.fetch('/searchableItem/savejson', {
            method: 'post',
            body: json(item)
          })
          .then(response => response.json())
          .then(result => {
              this.result = result;
          });
    
    alert("Updated");
    this.controller.close();
    
  }

  close(){
    //RM ? necessary RM this.reset();
    this.controller.close();
  }


}