import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import {EventAggregator} from 'aurelia-event-aggregator';
import {DialogService} from 'aurelia-dialog';
import 'fetch';
import {CreateSampleRequest} from './sample_request/createSampleRequest';
import {CreateEditDialog} from './edit_request/create-edit-dialog';
import {EditSearchableItem} from './items/editSearchableItem';


@inject(HttpClient, EventAggregator, DialogService)
export class Index {
  heading = 'Looks for a Collection';
  rows = [];
  seasons = [];
  brands = [];
  itemTypes = [];
  colors = [];
  
  selectedBrand = '';
  selectedSeason = '';
  selectedItemType = '';
  selectedColor = '';
  searchText = '';
  availableFrom = '';
  availableTo = '';

  numberImages = 0;
  
  

  filterChange(event){
    console.log("changing");
    console.log(this.selectedBrand);
    console.log(this.selectedSeason);
    console.log(this.selectedItemType);
    console.log(this.searchText);
    console.log(this.availableFrom);
    console.log(this.availableTo);

    this.http.fetch('/searchableItem/filterSearch?searchtext='+ encodeURI(this.searchText) + 
                                      '&brand=' + this.selectedBrand + 
                                      '&season=' + encodeURI(this.selectedSeason) + 
                                      '&itemType=' + this.selectedItemType + 
                                      '&availableFrom=' + this.availableFrom + 
                                      '&availableTo=' + this.availableTo)
          .then(response => response.json())
          .then(rows => {this.rows = rows})
          .then(rows => {this.numberImages = this.rows[0].item1.numberImages});
  }


  constructor(http, eventAggregator,dialogService) {
    http.configure(config => {
      config
        .useStandardConfiguration();
    });
    this.ea = eventAggregator;
    this.http = http;
    this.boundHandler = this.handleKeyInput.bind(this);
    this.dialogService = dialogService;

  }



  attached(){
    
    this.subscriber = this.ea.subscribe('datepicker', response => {
            if(response.elementId === 'datepickerto')
              this.availableTo = response.elementValue;
            if(response.elementId === 'datepickerfrom') 
              this.availableFrom = response.elementValue;
            this.filterChange();
            
    });

    
     
    
  }

  activate() {
    window.addEventListener('keypress', this.boundHandler, false);

    return Promise.all([
      this.http.fetch('/dashboard/seasons').then(response => response.json()).then(seasons => this.seasons = seasons),
      this.http.fetch('/dashboard/itemTypes').then(response => response.json()).then(itemTypes => this.itemTypes = itemTypes),
      this.http.fetch('/brand/index.json').then(response => response.json()).then(brands => this.brands = brands),
      this.http.fetch('/dashboard/colors').then(response => response.json()).then(colors => this.colors = colors)

    ]);
  }

  deactivate() {
   window.removeEventListener('keypress', this.boundHandler);
  }

  handleKeyInput(event) {
    console.log(event);
    if(event.which == 13 && event.srcElement.id === 'search-images') {
      console.log("user hit enter");
      this.filterChange(event);

    }
  }
 
  /* RM accordion expansion button */
  closeExpand(buttonNumber) {
    var buttonChoice = document.getElementById("button" + buttonNumber);
    var panelChoice = document.getElementById("panel" + buttonNumber);
    buttonChoice.classList.toggle("active");
    panelChoice.classList.toggle("show");  
  }

  lookMenu(id){
    var menu = document.getElementById("look-"+id);
    menu.classList.toggle("look-menu-show");
  }

  createSampleRequestModal(itemId) {
    this.lookMenu(itemId);
    this.dialogService.open({viewModel: CreateSampleRequest, model: itemId })
      .then(response => {});
  }

  editSearchableItem(itemId) {
    this.lookMenu(itemId);
    this.dialogService.open({viewModel: EditSearchableItem, model: itemId })
      .then(response => {});
  }

  // RM additional stuff for request edit -- needs to be abstracted //

  lookEditMenu(id){
    var menu = document.getElementById("requestTest"+id);
    menu.classList.toggle("look-menu-show");
  }

  createSampleEditModal(itemId) {
    var menu = document.getElementById("requestTest"+itemId);
    menu.classList.toggle("look-menu-show");
    this.dialogService.open({viewModel: CreateEditDialog, model: itemId })
      .then(response => {});
  }


    
}


