import {customElement, bindable, inject,bindingMode} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import 'fetch';


@inject(HttpClient, Element)
@customElement('filters-color')

export class FiltersColorCustomElement {
  colors = [];
  
  //@bindable({ defaultBindingMode: bindingMode.twoWay }) color;
  @bindable coloro = '';

  constructor(http, element){
    this.http = http;
    this.element = element;
  }

  setColor(event) {
  	this.coloro = event.detail.value;
  }
  

	attached() {
	    return Promise.all([
	      this.http.fetch('/dashboard/colors').then(response => response.json()).then(colors => this.colors = colors)
	    ]);
	}


}

