import {customElement, bindable, inject,bindingMode} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import 'fetch';


@inject(HttpClient)
@customElement('filters-filterrequests')

export class FiltersFilterrequestsCustomElement {
  filters = ["ACTIVE REQUESTS","ALL REQUESTS","INACTIVE REQUESTS", "MY REQUESTS","OVERDUE REQUESTS"];
  selectorselector = false;
  selectorall = false;

  @bindable ordero = '';

  constructor(http, element){
    this.http = http;
    this.element = element;
  }

  setFilter(event) {
  	this.ordero = event.detail.value;
  }
  

	attached() {
	    //return Promise.all([
	      //this.http.fetch('/dashboard/cities').then(response => response.json()).then(cities => this.cities = cities)
	    //]);
	}


}

