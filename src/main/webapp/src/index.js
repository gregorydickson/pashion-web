import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import 'fetch';

@inject(HttpClient)
export class Index {
  heading = 'Looks for a Collection';
  looks = [];
  seasons = [];
  brands = [];
  itemTypes = [];
  
  selectedBrand = '';
  selectedSeason = '';
  selectedItemType = '';
  searchText = '';
  availableFrom = '';
  availableTo = '';

  filterChange(event){
    console.log("changing");
    console.log(this.selectedBrand);
    console.log(this.selectedSeason);
    console.log(this.selectedItemType);
    console.log(this.searchText);
    console.log(this.availableFrom);
    console.log(this.availableTo);

    this.http.fetch('/look/filterSearch?searchtext='+ encodeURI(this.searchText) + 
                                      '&brand=' + this.selectedBrand + 
                                      '&season=' + encodeURI(this.selectedSeason) + 
                                      '&itemType=' + this.selectedItemType + 
                                      '&availableFrom=' + this.availableFrom + 
                                      '&availableTo=' + this.availableTo)
          .then(response => response.json())
          .then(looks => {this.looks = looks})
  }


  constructor(http) {
    http.configure(config => {
      config
        .useStandardConfiguration();
    });
    this.http = http;
    this.boundHandler = this.handleKeyInput.bind(this);
  }

  activate() {
    window.addEventListener('keypress', this.boundHandler, false);
    return Promise.all([
      this.http.fetch('/brandCollection/seasons').then(response => response.json()).then(seasons => this.seasons = seasons),
      this.http.fetch('/brandCollection/itemTypes').then(response => response.json()).then(itemTypes => this.itemTypes = itemTypes),
      this.http.fetch('/brand/index.json').then(response => response.json()).then(brands => this.brands = brands)

    ]);
  }

  deactivate() {
   window.removeEventListener('keypress', this.boundHandler);
  }

  handleKeyInput(event) {
    console.log(event);
    if(event.which == 13 && event.srcElement.id === "search") {
      console.log("herow");
      filterChange();

    }
  }
 
  /* RM accordion expansion button */
  closeExpand(buttonNumber) {
    var buttonChoice = document.getElementById("button" + buttonNumber);
    var panelChoice = document.getElementById("panel" + buttonNumber);
    buttonChoice.classList.toggle("active");
    panelChoice.classList.toggle("show");  
  }
    
}


