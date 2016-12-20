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
//  brands = [];

  colors = [];
  themes = [];
  
  selectedBrand = 37;
  selectedSeason = '';

  selectedColor = '';
  selectedTheme = '';
  searchText = '';
  
  

  filterChange(){
    console.log("Filter Change changing");
    if(event)
      if(event.detail)
        if(event.detail.value){
          this.selectedBrand = event.detail.value;
          console.log("value:"+event.detail.value)
        }
    console.log("Filter change called,Brand: " + this.selectedBrand);
    this.http.fetch('/searchableItem/filterSearch?searchtext='+ encodeURI(this.searchText) + 
                                      '&brand=' + this.selectedBrand + 
                                      '&season=' + encodeURI(this.selectedSeason) + 
                                      '&theme='+ this.selectedTheme)
          .then(response => response.json())
          .then(rows => {
            this.rows = rows;
          })

         .then (result => $("img.lazy").unveil()) // initial unveil of first images on load
         .then (result => $('div.cards-list-wrap').animate({scrollTop: $('div.cards-list-wrap').offset().top - 250}, 'slow'))
          ;
  }


  constructor(http,dialogService,busy) {
    http.configure(config => {
      config
        .useStandardConfiguration();
    });
    this.http = http;
    this.dialogService = dialogService;
    this.busy = busy;

    this.boundHandler = this.handleKeyInput.bind(this);
  }


  attached(){
    this.filterChange();
    document.getElementById('search-images').addEventListener('keypress', this.boundHandler, false);
  }

  detached() {
   window.removeEventListener('keypress', this.boundHandler);
  }


  activate() {
    return Promise.all([
      this.http.fetch('/dashboard/seasons').then(response => response.json()).then(seasons => this.seasons = seasons),
     // this.http.fetch('/brand/index.json').then(response => response.json()).then(brands => this.brands = brands),
      this.http.fetch('/dashboard/colors').then(response => response.json()).then(colors => this.colors = colors),
      this.http.fetch('/dashboard/themes').then(response => response.json()).then(themes => this.themes = themes),
      this.http.fetch('/dashboard/keywords').then(response => response.json())
            .then(searchText => {
              //this.searchText = searchText[0];
              //this.filterChange();
              })
    ]);
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

    handleKeyInput(event) {
   console.log(event);
    if(event.which == 13 && event.srcElement.id === 'search-images') {
      console.log("user hit enter");
      this.filterChange(event);
    }
  }



}


