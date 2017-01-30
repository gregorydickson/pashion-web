import {DialogController} from 'aurelia-dialog';
import {HttpClient,json} from 'aurelia-fetch-client';
import 'fetch';
import {inject, bindable} from 'aurelia-framework';
import {DateFormat} from 'common/dateFormat';
import {CityService} from 'services/cityService';

@inject(HttpClient, DialogController,CityService)
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
  selectedSample = {};

  listID = 'colors';

  @bindable addColor = '';
  

  constructor(http, controller,cityService){
    this.controller = controller;
    
    http.configure(config => {
      config
        .useStandardConfiguration();
    });
    this.http = http;
    this.cityService = cityService;
  }

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
    
    alert("Updated");
    this.controller.close();
    
  }

  close(){
    //RM ? necessary RM this.reset();
    this.controller.close();
  }


}