import {customElement, bindable, inject,bindingMode} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import {CityService} from 'services/cityService';
import 'fetch';


@inject(HttpClient, CityService)
@customElement('filters-city')

export class FiltersCityCustomElement {
  cities = [];
  selectorselector = true;
  selectorall = true;

  @bindable cityo = '';

  constructor(http, cityService, element){
    this.http = http;
    this.cityService = cityService;
    this.element = element;
  }

  setCity(event) {
  	this.cityo = event.detail.value;
  }
  
  activate () {     


  }

	attached() {

    return Promise.all([
        //this.http.fetch('/dashboard/cities').then(response => response.json()).then(cities => this.cities = cities)

      this.cityService.getCities().then(cities => { this.cities = cities; })
        

      ]);

	}
}

