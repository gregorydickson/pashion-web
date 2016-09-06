import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import 'fetch';

@inject(HttpClient)
export class Calendar {
  
  calendar = [];
  row0 = [];
  row1 = [];
  row2 = [];
  row3 = [];
  row4 = [];
  row5 = [];



  constructor(http) {
    http.configure(config => {
      config
        .useStandardConfiguration();
    });
    this.http = http;
  }

  //add date and locale params
  activate() {
    return this.http.fetch('/calendar/')
          .then(response => response.json())
          .then(calendar => {
              this.row0 = calendar.rows[0];
              this.row1 = calendar.rows[1];
              this.row2 = calendar.rows[2];
              this.row3 = calendar.rows[3];
              this.row4 = calendar.rows[4];
              this.row5 = calendar.rows[5];
          })
      
  }

  submit() {
    
  }
}
