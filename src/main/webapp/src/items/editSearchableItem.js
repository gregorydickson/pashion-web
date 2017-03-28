import {DialogController} from 'aurelia-dialog';
import {HttpClient,json} from 'aurelia-fetch-client';
import 'fetch';
import {inject, bindable} from 'aurelia-framework';
import {DateFormat} from 'common/dateFormat';
import {CityService} from 'services/cityService';
import {DialogService} from 'aurelia-dialog';
import { CreateDialogAlert } from 'common/dialogAlert';


@inject(HttpClient, DialogController,CityService, DialogService)
export class EditSearchableItem {
  static inject = [DialogController];
  isLoading = true;

  currentItem = {};
  result = {};

  itemTypes = [];
  sampleTypes = [];

  availableSampleItems = [];
  selectedSampleItems = [];
  availableSampleTypeItems = [];
  selectedSampleTypeItems = [];
  availableNewColorItems = [];
  selectedNewColorItems = [];
  availableMaterialItems = [];
  selectedMaterialItems = [];
  availableLocationItems = [];
  selectedLocationItems = [];

  colors = [];
  material = [];
  cities = [];

  createdNew = true;

  @bindable selectedSample = {};

  listID = 'colors';

  @bindable addColor = '';
  
  showSampleEdit = false;

  constructor(http, controller,cityService, dialogService){
    this.controller = controller;
    
    http.configure(config => {
      config
        .useStandardConfiguration();
    });
    this.http = http;
    this.cityService = cityService;
    this.dialogService = dialogService;
  }


  activate(itemId){
    var queryString = DateFormat.urlString(0, 1);
    this.cityService.getCities().then(cities => {
      this.cities = cities;

      cities.forEach(item => {
          this.availableLocationItems.push({
            id: item.id,
            text: item.name
          });
        });
    });
    Promise.all([
      this.http.fetch('/dashboard/itemTypes').then(response => response.json()).then(itemTypes => {
      this.itemTypes = itemTypes
    }),
    this.http.fetch('/dashboard/sampleTypes').then(response => response.json()).then(sampleTypes => {
      this.sampleTypes = sampleTypes

       sampleTypes.forEach(item => {
          this.availableSampleTypeItems.push({
            id: item,
            text: item
          });
        });
    }),
    this.http.fetch('/dashboard/colors').then(response => response.json()).then(colors => {
      this.colors = colors

      colors.forEach(item => {
          this.availableNewColorItems.push({
            id: item,
            text: item
          });
        });
    }),
    this.http.fetch('/dashboard/material').then(response => response.json()).then(material => {
      this.material = material

      material.forEach(item => {
          this.availableMaterialItems.push({
            id: item,
            text: item
          });
        });
    }),
    this.http.fetch('/searchableItem/fetchdeep/'+itemId+'.json')
      .then(response => response.json())
      .then(item => {
          this.currentItem = item;
          this.createdNew = false;

          item.samples.forEach(item => {
            this.availableSampleItems.push({
              id: item.id,
              text: item.attributes
            });
          });
          
          this.selectedSampleItems = [""];
    })
    ]).then(() => this.isLoading = false);
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

  materialAdd (sample) {
    if (!this.addMaterial) return;
    if (this.addMaterial=='') return;
    if(sample.material)
      sample.material = sample.material + " " + this.addMaterial;
    else
      sample.material = this.addMaterial;
  }

  materialClear (sample) {
    sample.material = '';
  }

  sample2Callback(event) {
    console.log('sample2Callback() called:', event.detail.value);

    if (event.detail) {
        let selectedValue = event.detail.value;         
        console.log('Selected value:', selectedValue); 

        this.selectedSample = selectedValue; //this.availableSampleItems.find(x => x.id == selectedValue);
        this.selectedLocationItems = [this.selectedSample.sampleCity.id];
        this.showSampleEdit = (this.selectedSample !== null);
    }
  }

  onSampleChangeCallback(event) {   
      console.log('onSampleCallback() called:', event.detail.value);

      if (event.detail) {
          let selectedValue = event.detail.value;         
          console.log('Selected value:', selectedValue);    

          this.selectedSample =  this.availableSampleItems.find(x => x.id == selectedValue);
          this.showSampleEdit = (this.selectedSample !== null);   
      }
  }

  onSampleTypeChangeCallback(event) {   
      console.log('onSampleTypeCallback() called:', event.detail.value);

      if (event.detail) {
          let selectedValue = event.detail.value;         
          console.log('Selected value:', selectedValue);     

          this.selectedSample.sampleType = selectedValue; 
      }
  }

  onNewColorChangeCallback(event) {   
      console.log('onNewColorChangeCallback() called:', event.detail.value);

      if (event.detail) {
          let selectedValue = event.detail.value;         
          console.log('Selected value:', selectedValue);      

          this.selectedSample.color = selectedValue;
      }
  }

  onMaterialChangeCallback(event) {   
      console.log('onMaterialChangeCallback() called:', event.detail.value);

      if (event.detail) {
          let selectedValue = event.detail.value;         
          console.log('Selected value:', selectedValue);      

          this.selectedSample.material = selectedValue;
      }
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
      this.currentItem.samples.push(newsample);    
      this.selectedSample = newsample;
      
      this.availableSampleItems.push({ id: 0, text: newsample.attributes });
      this.selectedSampleItems.push({ id: 0, text: newsample.attributes });
    }
  }
 

  submit(){

    var item = this.currentItem;
    console.log("submitting Image Data");
    console.log(JSON.stringify(item));
    //add attributes from samples to the look
    item.samples.forEach(sample => {
      let addAttributes = '';
      if(sample.sampleType)
        addAttributes = sample.sampleType
      if(sample.description)
        addAttributes = addAttributes +" "+ sample.description;
      if(sample.material)
        addAttributes = addAttributes +" "+ sample.material;
      if(sample.color)
        addAttributes = addAttributes +" "+sample.color;

      item.attributes = item.attributes +" "+ addAttributes;
    });
    

    this.http.fetch('/searchableItem/savejson', {
            method: 'post',
            body: json(item)
          })
          .then(response => response.json())
          .then(result => {
              this.result = result;
          });
    
    this.alertP("Updated");
    
  }

  close(){
    this.controller.close();
  }

  

}