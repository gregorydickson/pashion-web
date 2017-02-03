import {customElement, bindable, inject,bindingMode} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import 'fetch';


@inject(HttpClient)
@customElement('filters-city')

export class FiltersCityCustomElement {
  cities = [];
  selectorselector = true;
  selectorall = true;

  @bindable cityo = '';

  constructor(http, element){
    this.http = http;
    this.element = element;
  }

  setCity(event) {
  	this.cityo = event.detail.value;
  }
  

	attached() {
	    return Promise.all([
	      this.http.fetch('/dashboard/cities').then(response => response.json()).then(cities => this.cities = cities)
	    ]);
	}


}

