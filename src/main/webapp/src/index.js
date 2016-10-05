import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import {EventAggregator} from 'aurelia-event-aggregator';
import 'fetch';


@inject(HttpClient, EventAggregator)
export class Index {
  heading = 'Looks for a Collection';
  looks = [];
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
  
  getMore(topIndex, isAtBottom, isAtTop) {
        for(let i = 0; i < 100; ++i) {
            this.looks.push('look' + i);
        }
    }

  filterChange(event){
    console.log("changing");
    console.log(this.selectedBrand);
    console.log(this.selectedSeason);
    console.log(this.selectedItemType);
    console.log(this.searchText);
    console.log(this.availableFrom);
    console.log(this.availableTo);

    this.http.fetch('/pashionSearch/filterSearch?searchtext='+ encodeURI(this.searchText) + 
                                      '&brand=' + this.selectedBrand + 
                                      '&season=' + encodeURI(this.selectedSeason) + 
                                      '&itemType=' + this.selectedItemType + 
                                      '&availableFrom=' + this.availableFrom + 
                                      '&availableTo=' + this.availableTo)
          .then(response => response.json())
          .then(looks => {this.looks = looks})
          .then(looks => {this.numberImages = this.looks.length});
  }


  constructor(http, eventAggregator) {
    http.configure(config => {
      config
        .useStandardConfiguration();
    });
    this.ea = eventAggregator;
    this.http = http;
    this.boundHandler = this.handleKeyInput.bind(this);

  }



  attached(){
    
    this.subscriber = this.ea.subscribe('datepicker', response => {
            if(response.elementId === 'datepickerto')
              this.availableTo = response.elementValue;
            if(response.elementId === 'datepickerfrom') 
              this.availableFrom = response.elementValue;
            this.filterChange();
            
    });

    return this.http.fetch('/searchableItems.json')
        .then(response => response.json())
        .then(response => this.looks = response.searchableItems)
        .then(looks => {this.numberImages = looks.length});
     
    
  }

  activate() {
    window.addEventListener('keypress', this.boundHandler, false);

    return Promise.all([
      this.http.fetch('/brandCollection/seasons').then(response => response.json()).then(seasons => this.seasons = seasons),
      this.http.fetch('/brandCollection/itemTypes').then(response => response.json()).then(itemTypes => this.itemTypes = itemTypes),
      this.http.fetch('/brand/index.json').then(response => response.json()).then(brands => this.brands = brands),
      this.http.fetch('/brandCollection/colors').then(response => response.json()).then(colors => this.colors = colors)

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
    
}


