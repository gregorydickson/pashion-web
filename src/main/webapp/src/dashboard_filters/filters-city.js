import {customElement, bindable, inject,bindingMode} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import 'fetch';


@inject(HttpClient)
@customElement('filters-city')

export class FiltersCityCustomElement {
  cities = [];
  
  //@bindable({ defaultBindingMode: bindingMode.twoWay }) city;
  @bindable city0 = '';

  constructor(http, element){
    this.http = http;
    this.element = element;
  }

  setCity(event) {
  	this.city = event.detail.value;
  }
  

	attached() {
	    return Promise.all([
	      this.http.fetch('/dashboard/cities').then(response => response.json()).then(cities => this.cities = cities)
	    ]);
	}


}

