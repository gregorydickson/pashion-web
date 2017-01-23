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
  selectedProductIds = [];
  selectAll = true;


  

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
          var ids = this.selectedProductIds;
          item.samples.forEach(function(item){
            ids.push(item.id);
          })
        }
      );


    var queryString = DateFormat.urlString(0, 1);
    this.http.fetch('/calendar/searchableItemPicker' +queryString+"&item="+itemId)
    	.then(response => response.json())
      .then(calendar => {
              this.calendar = calendar;
    });

    
  }

  next(){
  	var queryString = DateFormat.urlString(++this.offset,1);
    this.http.fetch('/calendar/showAvailabilityLookAndSamples'+queryString, {
            method: 'post',
            body: json(this.selectedProductIds)
          })
          .then(response => response.json())
          .then(calendar => {
              this.calendar = calendar;
          });
  }

  previous(){
  	var queryString = DateFormat.urlString(--this.offset,1);
    this.http.fetch('/calendar/showAvailabilityLookAndSamples'+queryString, {
            method: 'post',
            body: json(this.selectedProductIds)
          })
          .then(response => response.json())
          .then(calendar => {
              this.calendar = calendar;
          });
  }

  reset(){
  	var queryString = DateFormat.urlString(0,1);
    this.http.fetch('/calendar/showAvailabilityLookAndSamples'+queryString, {
            method: 'post',
            body: json(this.selectedProductIds)
          })
          .then(response => response.json())
          .then(calendar => {
              this.calendar = calendar;
          });
  }

  allsamples(event){
    console.log("all samples"+event.srcElement.checked);
    if(event.srcElement.checked) {
      for (var i = 0, len = this.currentItem.samples.length; i < len; i++) {
        if(!(this.selectedProductIds.includes(this.currentItem.samples[i].id))){
          this.selectedProductIds.push(this.currentItem.samples[i].id);
        }
      }
    } else {
      this.selectedProductIds = [];
      //document.getElementById("CreateSampleRequestButton").disabled = true;
    } 
  }

  allSamplesSelected() {
    let samplesSelected = this.selectedProductIds;
    let samples = this.currentItem.samples;

    if (samples.length != samplesSelected.length) {
      this.selectAll = false;
      console.log("length not equal");
      return;
    } else {
      this.selectAll = true;
    }
    //this.enableCheck();
  }

  
 updateAvailability(){
    this.allSamplesSelected();
    console.log ("update availability");
    console.log ("current item samples:"+this.currentItem.samples);
    console.log (this.selectedProductIds);
    var queryString = DateFormat.urlString(this.offset,1);
    this.http.fetch('/calendar/showAvailabilityLookAndSamples'+queryString, {
            method: 'post',
            body: json(this.selectedProductIds)
          })
          .then(response => response.json())
          .then(calendar => {
              this.calendar = calendar;
          });
  }

  close(){
    
    this.controller.close();
    
  }


}