import {DialogController} from 'aurelia-dialog';
import {HttpClient,json} from 'aurelia-fetch-client';
import 'fetch';
import {inject, bindable} from 'aurelia-framework';
import {DateFormat} from 'common/dateFormat';
import {CityService} from 'services/cityService';
import {OutReasonService} from 'services/outReasonService';
import {DialogService} from 'aurelia-dialog';
import { CreateDialogAlert } from 'common/dialogAlert';


@inject(HttpClient, DialogController,CityService, OutReasonService, DialogService)
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
  availableOutReasonItems = [];
  selectedOutReasonItems = [];

  colors = [];
  material = [];
  cities = [];
  outReasons = [];

  createdNew = true;

  @bindable selectedSample = {};

  listID = 'colors';

  @bindable addColor = '';
  
  showSampleEdit = false;

  constructor(http, controller,cityService, outReasonService, dialogService){
    this.controller = controller;
    
    http.configure(config => {
      config
        .useStandardConfiguration();
    });
    this.http = http;
    this.cityService = cityService;
    this.outReasonService = outReasonService;
    this.dialogService = dialogService;
  }


  activate(itemId){
    var queryString = DateFormat.urlString(0, 1);
    this.cityService.getCities().then(cities => {
      this.cities = cities;
      this.availableLocationItems = cities.map(value => {return {id: value.id, text:value.name.toUpperCase()};});
    });
    this.outReasonService.getOutReasons().then(outReasons => {
      this.outReasons = outReasons;
      this.availableOutReasonItems = outReasons.map(value => {return {id: value.id, text:value.name.toUpperCase()};});
    });
    Promise.all([
      this.http.fetch('/dashboard/itemTypes').then(response => response.json()).then(itemTypes => {
      this.itemTypes = itemTypes
    }),
    this.http.fetch('sampleType/list').then(response => response.json()).then(sampleTypes => {
      this.sampleTypes = sampleTypes

       sampleTypes.forEach(item => {
          this.availableSampleTypeItems.push({
            id: item.toUpperCase(),
            text: item.toUpperCase()
          });
        });
    }),
    this.http.fetch('/color/list').then(response => response.json()).then(colors => {
      this.colors = colors

      colors.forEach(item => {
          this.availableNewColorItems.push({
            id: item,
            text: item 
          });
        });
    }),
    this.http.fetch('/material/list').then(response => response.json()).then(material => {
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
          // break out number and variant
          //this.nameNumber = parseInt(this.currentItem.name.replace(/\D/g,''));
          //this.nameVariant = this.currentItem.name.replace(/[0-9]/g, '');
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

          // sort items according id number
          this.availableSampleItems.sort((a,b) => { return (a.id > b.id) * 1});


          this.selectedSampleItems = [""];
    })
    ]).then(() => this.isLoading = false);
  }


  alertP (message){
        this.dialogService.open({ viewModel: CreateDialogAlert, model: {title:"Edit", message:message, timeout:5000}, lock:false }).then(response => {});
    }

  typeNewAdd (sample) {
    let thisValue = $('#unl-type').val().toUpperCase();
    console.log('Selected value:', thisValue);      

    var bool = true;
    this.availableMaterialItems.forEach(item => {
        console.log(item.id);
         if(item.id == thisValue){
          bool = false;
          console.log("SampleType already present in list");
        }
    });
     if(bool){
      this.http.fetch('/sampleType/newSampleType?name=' + thisValue, {
            method: 'post',
            body: {"this":"one"}
      }).then(response => {
    this.http.fetch('/sampleType/list').then(response => response.json()).then(types => {
    // this.selectedSampleType = selectedSampleType
    this.availableSampleTypeItems = [];
    
    types.forEach(item => {
        this.availableSampleTypeItems.push({
          id: item,
          text: item
        });
      });
    });});
     }


    
    this.selectedSampleTypeItems = [thisValue];
    $('[name="type"]').find('select').val(thisValue).trigger('change');

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

  colorNewAdd (sample) {
    let thisValue = $('#unl-col').val().toUpperCase();
    console.log('Selected value:', thisValue);      

    var bool = true;
    this.availableNewColorItems.forEach(item => {
        console.log(item.id);
         if(item.id == thisValue){
          bool = false;
          console.log("Color already present in list");
        }
    });
     if(bool){
      this.http.fetch('/color/newColor?name=' + thisValue, {
            method: 'post',
            body: {"this":"one"}
      }).then(response => {
    this.http.fetch('/color/list').then(response => response.json()).then(colors => {
    // this.material = colors
    this.availableNewColorItems = [];
    
    colors.forEach(item => {
        this.availableNewColorItems.push({
          id: item,
          text: item
        });
      });
    });});
     }

   


    this.unlColor = thisValue;

    if (!this.unlColor) return;
    if (this.unlColor=='') return;
    if(sample.color)
      sample.color = sample.color + " " + this.unlColor;
    else
      sample.color = this.unlColor;
  }

  materialAdd (sample) {
    if (!this.addMaterial) return;
    if (this.addMaterial=='') return;
    if(sample.material)
      sample.material = sample.material + " " + this.addMaterial;
    else
      sample.material = this.addMaterial;
  }
 
  materialNewAdd (sample) {
    let thisValue = $('#unl-mat').val().toUpperCase();
    console.log('Selected value:', thisValue);      

    var bool = true;
    this.availableMaterialItems.forEach(item => {
        console.log(item.id);
         if(item.id == thisValue){
          bool = false;
          console.log("Material already present in list");
        }
    });
     if(bool){
      this.http.fetch('/material/newMaterial?name=' + thisValue, {
            method: 'post',
            body: {"this":"one"}
      }).then(response => {
    this.http.fetch('/material/list').then(response => response.json()).then(material => {
    this.material = material
    this.availableMaterialItems = [];
    
    material.forEach(item => {
        this.availableMaterialItems.push({
          id: item,
          text: item
        });
      });
    });});
     }

   


    this.unlMaterial = thisValue;

    if (!this.unlMaterial) return;
    if (this.unlMaterial=='') return;
    if(sample.material)
      sample.material = sample.material + " " + this.unlMaterial;
    else
      sample.material = this.unlMaterial;
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
            console.log('Found a match for sample type:', selectedSampleType, selectedSampleType.id);
            this.selectedSampleTypeItems = [selectedSampleType.id];
          }
        } else{
          $('#type').val('').trigger('change');
        } 

        // Location
        if (this.selectedSample.sampleCity) {
          let selectedLocation = this.selectedSample.sampleCity;

          if (selectedLocation) {
            console.log('Found a match for location:', selectedLocation);
            this.selectedLocationItems = [selectedLocation.id];      
          }
        } else{
          $('#location').val('').trigger('change');
        }        

        // out Reason 
        if (this.selectedSample.outReason) {
          this.selectedOutReasonItems = this.selectedSample.outReason.id;

        } else {
          $('#outReason').val('').trigger('change');
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

  onOutReasonChangeCallback(event) {   
      console.log('onOutReasonChangeCallback() called:', event.detail.value);
      if (event.detail) {
          if(event.detail.value){
            let selectedValue = event.detail.value;         
            console.log('Selected out Reason value:', selectedValue);     

            if (this.selectedSample.outReason) this.selectedSample.outReason.id = parseInt(selectedValue); 
            else this.selectedSample["outReason"] = {id:parseInt(selectedValue)};
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
      newsample.sampleCity = {};
      newsample.outReason = {};
      newsample.sampleCity.id = this.availableLocationItems[0].id;
      this.selectedLocationItems = this.availableLocationItems[0];
      newsample.type = this.selectedSampleTypeItems[0];
      newsample.message = '';
      console.log("new sample city:"+newsample.sampleCity.id);
      console.log("new sample type:"+newsample.type);

      this.currentItem.samples.push(newsample);    
      
      
      this.availableSampleItems.push({ id: this.newSampleId , text: "NEW" });
      this.selectedSampleItems = [this.newSampleId]
      this.selectedSample = this.currentItem.samples.find(x => {x.id == this.newSampleId});
    }
  }

  deleteSample(){
    console.log("deleting sample");
    let sampleId = this.selectedSample.id;
    console.log("sample ID:"+sampleId);
    let sampleIndex = this.currentItem.samples.indexOf(this.selectedSample);
    console.log("sample index:"+sampleIndex);
    this.currentItem.samples.splice(sampleIndex,1);

    let index = this.availableSampleItems.findIndex(x => {
      console.log("x id:"+x.id);

      if(x.id ===sampleId) return true;
    });
    console.log("index in available sample items"+index);
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
    item.name = this.currentItem.nameNumber + this.currentItem.nameVariant;
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
      if(sample.outReason)
        addAttributes = addAttributes +" "+sample.outReason.name;

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
    this.controller.close(true);
  }

  close(){
    this.controller.close(false);
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