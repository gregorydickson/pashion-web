import {customElement, bindable, inject,bindingMode} from 'aurelia-framework';
// import {HttpClient} from 'aurelia-fetch-client';
import 'fetch';


// @inject(HttpClient)
@customElement('filters-show-available')

export class FiltersShowAvailableCustomElement {
  availableStates = ["IN-HOUSE", "OUT"];
  selectorselector = true;
  selectorall = false;

  @bindable availableo = '';

  constructor(http, element){
    this.element = element;
  }

  setAvailable(event) {
  	this.availableo = event.detail.value;
  }
  
  activate () {     


  }

	attached() {

    // return Promise.all([
      //this.cityService.getCities().then(cities => { this.cities = cities; })
        

     // ]);

	}
}

