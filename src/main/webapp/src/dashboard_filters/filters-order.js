import {customElement, bindable, inject,bindingMode} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import 'fetch';


@inject(HttpClient)
@customElement('filters-order')

export class FiltersOrderCustomElement {
  orders = ["By Date","By Person","By Request Number"];
  selectorselector = false;
  selectorall = false;

  @bindable ordero = '';

  constructor(http, element){
    this.http = http;
    this.element = element;
  }

  setOrder(event) {
  	this.ordero = event.detail.value;
  }
  

	attached() {
	    //return Promise.all([
	      //this.http.fetch('/dashboard/cities').then(response => response.json()).then(cities => this.cities = cities)
	    //]);
	}


}

