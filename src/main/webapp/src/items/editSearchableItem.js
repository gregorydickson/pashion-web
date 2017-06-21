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
  newSampleId = 0;
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

      this.availableLocationItems = cities.map(value => {return {id: value.id, text:value.name.toUpperCase()};});
      /*
      cities.forEach(item => {
          this.availableLocationItems.push({
            id: item.id,
            text: item.name.toUpperCase()
          });
        });
        */
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

    this.http.fetch('/dashboard/seasons').then(response => response.json()).then(seasons => this.seasons = seasons),
    this.http.fetch('/searchableItem/fetchdeep/'+itemId+'.json')
      .then(response => response.json())
      .then(item => {
          this.currentItem = item;
          this.createdNew = false;

          item.samples.forEach(item => {
            console.log("attrib:"+item.attributes);
            let attrib = cleanAttributes(item.attributes).toUpperCase();
            if(attrib.length < 31){
              this.availableSampleItems.push({
                id: item.id,
                text: attrib
              });
            } else{
              this.availableSampleItems.push({
                id: item.id,
                text: attrib.substr(0,27) + '...'
              });
            }
          });
          
          this.selectedSampleItems = [""];
    })
    ]).then(() => this.isLoading = false);
  }


  alertP (message){
        this.dialogService.open({ viewModel: CreateDialogAlert, model: {title:"Edit", message:message, timeout:5000}, lock:false }).then(response => {});
    }

  colorAdd (sample) {    
    if (!this.addColor) return;
    if (this.addColor=='') return;
    if(sample.color)
      sample.color = sample.color + " " + this.addColor;
    else
      sample.color = this.addColor;
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
    console.log('sample2Callback() called');

    if (event.detail) {
        console.log('sample2 value:'+event.detail.value)
        let selectedSampleId = event.detail.value;         
        console.log('sample2Callback() / Selected value:', selectedSampleId); 

        this.selectedSample = this.currentItem.samples.find(x => x.id == selectedSampleId);
        if(!this.selectedSample){

          return
        }
        // Sample type
        if (this.selectedSample.sampleType) {
          let selectedSampleType = this.availableSampleTypeItems.find(x => x.text.toUpperCase() == this.selectedSample.sampleType.toUpperCase());
          
          if (selectedSampleType) {
            console.log('Found a match for sample type:', selectedSampleType);
            this.selectedSampleTypeItems = [selectedSampleType.id];
          }
        }

        // Material
        if (this.selectedSample.material) {
          let selectedMaterial = this.availableMaterialItems.find(x => x.text.toUpperCase() == this.selectedSample.material.toUpperCase())
          
          if (selectedMaterial) {
            console.log('Found a match for material:', selectedMaterial);              
          }
        }

        // Location
        if (this.selectedSample.sampleCity) {
          let selectedLocation = this.selectedSample.sampleCity;

          if (selectedLocation) {
            console.log('Found a match for location:', selectedLocation);
            this.selectedLocationItems = [selectedLocation.id];      
          }
        }          
         
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

  onLocationChangeCallback(event) {   
      console.log('onLocationChangeCallback() called:', event.detail.value);
      if (event.detail) {
          if(event.detail.value){
            let selectedValue = event.detail.value;         
            console.log('Selected location value:', selectedValue);     

            this.selectedSample.sampleCity.id = selectedValue; 
          }
      }
  }

  onNewColorChangeCallback(event) {   
      console.log('onNewColorChangeCallback() called:', event.detail.value);

      if (event.detail) {
          let selectedValue = event.detail.value;         
          console.log('Selected value:', selectedValue);      

          this.addColor = selectedValue;
      }
  }


  onMaterialChangeCallback(event) {   
      console.log('onMaterialChangeCallback() called:', event.detail.value);

      if (event.detail) {
          let selectedValue = event.detail.value;         
          console.log('Selected value:', selectedValue);      

          this.addMaterial = selectedValue;
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
      this.newSampleId = this.newSampleId - 1;
      var newsample = {};
      newsample.name = "NEW";
      newsample.description = "NEW";
      newsample.attributes = "NEW";
      newsample.id = this.newSampleId;
      newsample.sampleCity = {}
      newsample.sampleCity.id = this.availableLocationItems[0].id;
      this.selectedLocationItems = this.availableLocationItems[0];
      newsample.type = this.selectedSampleTypeItems[0];
      newsample.message = '';
      console.log("new sample city:"+newsample.sampleCity.id);
      console.log("new sample type:"+newsample.type);

      this.currentItem.samples.push(newsample);    
      
      
      this.availableSampleItems.push({ id: this.newSampleId , text: "NEW" });
      this.selectedSampleItems = [this.newSampleId]
      this.selectedSample = this.currentItem.samples.find(x => x.id == this.newSampleId);
    }
  }

  deleteSample(){
    console.log("deleting sample");
    let sampleId = this.selectedSample.id;
    this.currentItem.samples.splice(this.currentItem.samples.indexOf(this.selectedSample),1);
    let index = this.availableSampleItems.findIndex(x => {x.id ==sampleId});
    this.availableSampleItems.splice(index,1);

    
    
    this.selectedSample = {};
    
    if(this.currentItem.deletedSamples){
      this.currentItem.deletedSamples.push(sampleId);
    } else{
      this.currentItem.deletedSamples = [];
      this.currentItem.deletedSamples.push(sampleId);
    }
    $('#sample').val('SELECT SAMPLE').trigger('change');
    console.log("deleting sample done");
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
      if(sample.description && sample.description !== 'NEW')
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
    this.controller.close();
  }

  close(){
    this.controller.close();
  }

  

}

function cleanAttributes(value){
  if (!value) return;
  if (value==undefined) return;
  if (value=='') return;
  // remove ","
  value = value.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
    value = value.replace(/NEW/g, "");
    value = value.replace(/UNDEFINED/g, "");
    value = value.replace(/undefined/g, "");
  // remve duplciates
  var uniqueList=value.split(' ').filter(function(item,i,allItems){
    return i==allItems.indexOf(item);
  }).join(' ');

  return uniqueList;
}