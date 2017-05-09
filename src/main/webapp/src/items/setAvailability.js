import {DialogController} from 'aurelia-dialog';
import {HttpClient,json} from 'aurelia-fetch-client';
import 'fetch';
import {inject} from 'aurelia-framework';
import {DateFormat} from 'common/dateFormat';
import moment from 'moment';
import {computedFrom} from 'aurelia-framework';

@inject(HttpClient, DialogController)
export class SetAvailability {
  static inject = [DialogController];
  
  id = '';
  item = null;
  calendar = {};
  offset = 0;
  newDate = '';
  sampleRequestStartMonth = '';
  sampleRequestStartDay = '';
  

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
    this.http.fetch('/dashboard/seasons').then(response => response.json()).then(seasons => this.seasons = seasons);
    
  }

  attached(){
    document.getElementById("SetAvailabilityRequestButton").disabled = true;
  }

  setStartDate(event,dayEvent,day){

    console.log("set start date: "+event);
    console.log("parameterday: "+day);

    var today = new Date();
    let startdate = new Date(this.calendar.calendarMonths[0].year,this.calendar.calendarMonths[0].monthNumber-1,day);

    // quit if in the past
    // could also add in here, any business logic about if we want to book +1 day out?
    console.log("today: " + today);
    if (startdate <= today) { 
      console.log ("day is before today or is today, exit"); 
      this.newDate = '';
      this.sampleRequestStartMonth = '';
      this.sampleRequestStartDay = ''; 
      this.enableCheck()
      return; 
    }
    console.log ("day is in the future");

    //check availability
    var dayIsNotAvailable = dayEvent.indexOf("not-available")>=0;
    console.log ("setStartDate, calendar day contains unavailable: " + dayIsNotAvailable);
    if (dayIsNotAvailable) {
      this.newDate = '';
      this.sampleRequestStartMonth = '';
      this.sampleRequestStartDay = '';
      this.enableCheck()
      return;  
    }

  	//var element = event.srcElement.parentElement;
  	//var document = element.ownerDocument;
  	//var elems = document.querySelectorAll(".start-selected");
  	//[].forEach.call(elems, function(el) {
    //	el.classList.remove("start-selected");
	  //});
  	//element.className += " start-selected";
  	//this.redraw(element);
    //this.newDate = this.calendar.calendarMonths[0].year+"-"+this.calendar.calendarMonths[0].monthNumber+"-"+day;
    // needs to be in "dd-M-yy" format for external consumption
    //RM tested. but unsure if we need to propergate other format changes
    this.newDate = moment(day+"-"+this.calendar.calendarMonths[0].monthNumber+"-"+this.calendar.calendarMonths[0].year,"D-M-YYYY" ,false).format('DD-MMM-YYYY');
    this.sampleRequestStartMonth = this.calendar.calendarMonths[0].monthNumber;
    this.sampleRequestStartDay = day;
    this.enableCheck()
  }

  @computedFrom('calendar.calendarMonths[0].monthNumber', 'sampleRequestStartMonth')
  get computedClass () { 
    if (this.calendar.calendarMonths[0].monthNumber == this.sampleRequestStartMonth) return true
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
    this.offset=0;
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

  enableCheck(){
    
    if(
       (this.newDate === undefined) || 
       (this.newDate === ''))
    {
          document.getElementById("SetAvailabilityRequestButton").disabled = true;
          console.log("button DIS abled");
    } else{
        document.getElementById("SetAvailabilityRequestButton").disabled = false; 
        console.log("button ENabled");
    }
  }


}