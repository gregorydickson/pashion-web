import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import {DialogService} from 'aurelia-dialog';
import 'fetch';
import {Zoom} from './zoom/zoom';
import {UserService} from './services/userService';
import {busy} from './services/busy';


@inject(HttpClient,  DialogService, busy)
export class Guestpage {
 
  rows = [];
  seasons = [];
  brands = [];

  colors = [];
  themes = [];
  
  selectedBrand = 8;
  selectedSeason = '';

  selectedColor = '';
  selectedTheme = '';
  searchText = '';
  
  

  filterChange(){
    console.log("Filter change called: " + this.searchText);
    this.busy.on();
    this.http.fetch('/searchableItem/filterSearch?searchtext='+ encodeURI(this.searchText) + 
                                      '&brand=' + this.selectedBrand + 
                                      '&season=' + encodeURI(this.selectedSeason) + 
                                      '&theme='+ this.selectedTheme)
          .then(response => response.json())
          .then(rows => {
            this.rows = rows;
            this.busy.off();
          });
  }


  constructor(http,dialogService,busy) {
    http.configure(config => {
      config
        .useStandardConfiguration();
    });
    this.http = http;
    this.dialogService = dialogService;
    this.busy = busy;
  }


  attached(){
    this.filterChange();
  }

  activate() {
    return Promise.all([
      this.http.fetch('/dashboard/seasons').then(response => response.json()).then(seasons => this.seasons = seasons),
      this.http.fetch('/brand/index.json').then(response => response.json()).then(brands => this.brands = brands),
      this.http.fetch('/dashboard/colors').then(response => response.json()).then(colors => this.colors = colors),
      this.http.fetch('/dashboard/themes').then(response => response.json()).then(themes => this.themes = themes),
      this.http.fetch('/dashboard/keywords').then(response => response.json())
            .then(searchText => {
              //this.searchText = searchText[0];
              //this.filterChange();
              })
    ]);
  }

  deactivate() {
   
  }

  createZoomDialog(item,rowNumber,itemNumber) {
    console.log("item number :"+itemNumber);
    console.log("item  :"+item);
    let menu = document.getElementById("card-"+item.id);
    
    menu.classList.toggle("blue-image");
    let zoomModel = {};
    zoomModel.item = item;
    zoomModel.rows = this.rows;
    zoomModel.itemNumber = itemNumber;
    zoomModel.rowNumber = rowNumber;
    this.dialogService.open({viewModel: Zoom, model: zoomModel })
      .then(response => {
        menu.classList.toggle("blue-image");
      });
  }



}


