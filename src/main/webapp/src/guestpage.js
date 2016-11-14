import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import {EventAggregator} from 'aurelia-event-aggregator';
import {DialogService} from 'aurelia-dialog';
import 'fetch';
import {CreateSampleRequest} from './sample_request/createSampleRequest';
import {EditSampleRequest} from './sample_request/editSampleRequest';
import {EditSearchableItem} from './items/editSearchableItem';
import {CheckAvailability} from './items/checkAvailability';
import {SetAvailability} from './items/setAvailability';
import {Introduction} from './hello/introduction';
import {Zoom} from './zoom/zoom';
import {SampleRequestService} from './services/sampleRequestService';
import {UserService} from './services/userService';


@inject(HttpClient,  DialogService)
export class Guestpage {
 
  rows = [];
  seasons = [];
  brands = [];

  colors = [];
  themes = [];
  
  selectedBrand = '';
  selectedSeason = '';

  selectedColor = '';
  selectedTheme = '';
  searchText = '';
  
  

  filterChange(){

    this.http.fetch('/searchableItem/filterSearch?searchtext='+ encodeURI(this.searchText) + 
                                      '&brand=' + this.selectedBrand + 
                                      '&season=' + encodeURI(this.selectedSeason) + 
                                      '&theme='+ this.selectedTheme)
          .then(response => response.json())
          .then(rows => {this.rows = rows});
  }


  constructor(http,dialogService) {
    http.configure(config => {
      config
        .useStandardConfiguration();
    });
    this.http = http;
    this.dialogService = dialogService;
  }


  attached(){
  }

  activate() {
    return Promise.all([
      this.http.fetch('/dashboard/seasons').then(response => response.json()).then(seasons => this.seasons = seasons),
      this.http.fetch('/brand/index.json').then(response => response.json()).then(brands => this.brands = brands),
      this.http.fetch('/dashboard/colors').then(response => response.json()).then(colors => this.colors = colors),
      this.http.fetch('/dashboard/themes').then(response => response.json()).then(themes => this.themes = themes),
      this.http.fetch('/dashboard/keywords').then(response => response.json())
            .then(searchText => {
              this.searchText = searchText[0];
              this.filterChange();
              })
    ]);
  }

  deactivate() {
   
  }

  createZoomDialog(itemId) {
    var menu = document.getElementById("card-"+itemId);
    menu.classList.toggle("blue-image");
    this.dialogService.open({viewModel: Zoom, model: itemId })
      .then(response => {
        menu.classList.toggle("blue-image");
      });
  }



}


