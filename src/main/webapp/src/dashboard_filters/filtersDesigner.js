import {customElement, bindable, inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import {EventAggregator} from 'aurelia-event-aggregator';
import 'fetch';


@inject(HttpClient, EventAggregator)
@customElement('filters-designer')

export class filtersDesigner {
  brands = [];
  
  selectedBrand = '';  

 setBrand(event){
    this.selectedBrand = event.detail.value
    console.log(event.detail.value);
    this.filterChange();
  }
  filterChange(event){
    console.log("brand:"+this.selectedBrand);
   
    this.http.fetch('&brand=' + this.selectedBrand)
          .then(response => response.json())
          .then(rows => {this.rows = rows})
          .then(rows => {this.numberImages = this.rows[0].numberImages});
  }

  activate() {
    
    return Promise.all([
      this.http.fetch('/brand/index.json').then(response => response.json()).then(brands => this.brands = brands),

    ]);
  }


}

