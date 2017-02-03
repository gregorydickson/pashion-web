import {customElement, bindable, inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import 'fetch';


@inject(HttpClient, Element)
@customElement('filters-theme')

export class FiltersThemeCustomElement {
  themes = [];
  
  //@bindable themeo = '';

  constructor(http,element){
    this.http = http;
    this.element = element;
  }
  
setTheme(event){
	this.selectedTheme = event.detail.value;
}

attached() {
    return Promise.all([
      this.http.fetch('/dashboard/themes').then(response => response.json()).then(themes => this.themes = themes)
    ]);
}


}