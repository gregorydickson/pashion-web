import {customElement, bindable, inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import {EventAggregator} from 'aurelia-event-aggregator';
import 'fetch';


@inject(HttpClient, EventAggregator)
@customElement('filters-search')

export class filtersSearch {
    searchText = '';

    filterChange(event){
    console.log(this.searchText);
    
    this.http.fetch('/searchableItem/filterSearch?searchtext='+ encodeURI(this.searchText))
          .then(response => response.json())
          .then(rows => {this.rows = rows})
          .then(rows => {this.numberImages = this.rows[0].numberImages});
	}


}

