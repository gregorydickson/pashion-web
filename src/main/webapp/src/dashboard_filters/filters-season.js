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


sortSeasons (array) {

    var iarray = array.slice(0)
        .sort(
          function (a, b) {
          //console.log (a["order"] + " " + b["order"] + " " + (a["order"] - b["order"] ));
          return (a["order"] - b["order"]) * -1  }
          );
    return iarray;
  } 


attached() {
    return Promise.all([
      this.http.fetch('/dashboard/seasonsByBrand').then(response => response.json()).then(seasons => this.seasons = this.sortSeasons(seasons))
    ]);
}


}

