import {customElement, bindable, inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import 'fetch';


@inject(HttpClient, Element)
@customElement('filters-season')

export class FiltersSeasonCustomElement {
  seasons = [];
  
  @bindable seasono = '';

  constructor(http,element){
    this.http = http;
    this.element = element;
  }
  
setSeason(event){
	this.seasono = event.detail.value;
}

attached() {
    return Promise.all([
      this.http.fetch('/dashboard/seasons').then(response => response.json()).then(seasons => this.seasons = seasons)
    ]);
}


}

