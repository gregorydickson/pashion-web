import {customElement, bindable, inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import {EventAggregator} from 'aurelia-event-aggregator';
import 'fetch';


@inject(HttpClient, EventAggregator)
@customElement('filters-type')

export class filtersType {

  itemTypes = [];
  
  selectedItemType = '';

  filterChange(event){
    console.log(this.selectedItemType);

    this.http.fetch('&itemType=' + this.selectedItemType)
          .then(response => response.json())
          .then(rows => {this.rows = rows})
          .then(rows => {this.numberImages = this.rows[0].numberImages});
   }

  activate() {
    
    return Promise.all([
      this.http.fetch('/dashboard/itemTypes').then(response => response.json()).then(itemTypes => this.itemTypes = itemTypes),
    ]);
  }


}

