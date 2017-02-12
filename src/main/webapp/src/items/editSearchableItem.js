import {DialogController} from 'aurelia-dialog';
import {HttpClient,json} from 'aurelia-fetch-client';
import 'fetch';
import {inject, bindable} from 'aurelia-framework';
import {DateFormat} from 'common/dateFormat';
import {CityService} from 'services/cityService';
import {ObserverLocator, observable} from 'aurelia-framework';  // or 'aurelia-framework'
import {DialogService} from 'aurelia-dialog';
import { CreateDialogAlert } from 'common/dialogAlert';


@inject(HttpClient, DialogController,CityService, ObserverLocator, DialogService)
export class EditSearchableItem {
  static inject = [DialogController];
  
  currentItem = {};
  result = {};

  itemTypes = [];
  sampleTypes = [];
  currentSample = {};
  colors = [];
  material = [];
  cities = [];

  createdNew = true;
  // @observable selectedSample = {};
  selectedSample = {};

  listID = 'colors';

  @bindable addColor = '';
  

  constructor(http, controller,cityService, observerLocator, dialogService){
    this.controller = controller;
    
    http.configure(config => {
      config
        .useStandardConfiguration();
    });
    this.http = http;
    this.cityService = cityService;
    this.dialogService = dialogService;
  }

 /* selectedSampleChanged(newValue, oldValue) {
    console.log("changed from: " + oldValue + " to " + newValue);
    if ((newValue != '') && (oldValue !='')) this.sampleChanged = true;
  } */

  activate(itemId){
    var queryString = DateFormat.urlString(0, 1);
    this.cityService.getCities().then(cities => this.cities = cities);
    this.http.fetch('/dashboard/itemTypes').then(response => response.json()).then(itemTypes => this.itemTypes = itemTypes);
    this.http.fetch('/dashboard/sampleTypes').then(response => response.json()).then(sampleTypes => this.sampleTypes = sampleTypes);
    this.http.fetch('/dashboard/colors').then(response => response.json()).then(colors => this.colors = colors);
    this.http.fetch('/dashboard/material').then(response => response.json()).then(material => this.material = material);
    this.http.fetch('/searchableItem/fetchdeep/'+itemId+'.json')
      .then(response => response.json())
      .then(item => {
          this.currentItem = item;
          this.createdNew = false;
    });
  }

  alertP (message){

        this.dialogService.open({ viewModel: CreateDialogAlert, model: {title:"Edit", message:message, timeout:5000} }).then(response => {});
    }

  colorAdd (sample) {
    if (!this.addColor) return;
    if (this.addColor=='') return;
    sample.color = sample.color + " " + this.addColor;
  }

  colorClear (sample) {
    sample.color = '';
  }


  filterChangeType(event) {
        //console.log("Filter Change changing Type");
        if (event)
            if (event.detail)
                if (event.detail.value) {
                    // if (event.detail.value == 'All') event.detail.value = '';
                    //if (event.detail.value == 'Select') event.detail.value = '';
                    this.selectedSample.sampleType = event.detail.value;
                    //console.log(" value: " + event.detail.value);
                  }
  }

  newsample(){
    if (!this.createdNew) {
      this.createdNew = true;
      var newsample = {};
      newsample.name = "NEW";
      newsample.description = "NEW";
      newsample.attributes = "NEW";
      this.currentItem.samples.push(newsample)
      this.selectedSample = newsample
    }
  }
 

  submit(){

    var item = this.currentItem;
    console.log("submitting Image Data");
    console.log(JSON.stringify(item));
    
    this.http.fetch('/searchableItem/savejson', {
            method: 'post',
            body: json(item)
          })
          .then(response => response.json())
          .then(result => {
              this.result = result;
          });
    
    this.alertP("Updated");
    //this.controller.close();
    
  }

  close(){
    //RM ? necessary RM this.reset();
    this.controller.close();
  }


}