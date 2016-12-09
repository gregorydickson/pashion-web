import {customElement, bindable, inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import {EventAggregator} from 'aurelia-event-aggregator';
import 'fetch';


@inject(HttpClient, EventAggregator)
@customElement('filters-season')

export class filtersSeason {
  seasons = [];
  
  selectedSeason = '';

  filterChange(event){
    console.log(this.selectedSeason);

    this.http.fetch('&season=' + encodeURI(this.selectedSeason))
          .then(response => response.json())
          .then(rows => {this.rows = rows})
          .then(rows => {this.numberImages = this.rows[0].numberImages});
  }

	activate() {
	    return Promise.all([
	      this.http.fetch('/dashboard/seasons').then(response => response.json()).then(seasons => this.seasons = seasons),
	   
	    ]);
	  }


}

