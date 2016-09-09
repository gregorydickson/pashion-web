import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import {DateFormat} from 'common/dateFormat';
import 'fetch';

@inject(HttpClient)
export class RequestCalendar{
  calendar = [];
  row0 = [];
  row1 = [];
  row2 = [];
  row3 = [];
  row4 = [];
  row5 = [];
  row6 = [];
  monthname = "";
  year = "";
  offset = 0;
  date = new Date();



  constructor(http) {
    http.configure(config => {
      config
        .useStandardConfiguration();
    });
    this.http = http;
  }

  //add date and locale params
  activate() {
    var queryString = DateFormat.urlString(0);
    
    return this.http.fetch('/calendar/index.json' + queryString)
          .then(response => response.json())
          .then(calendar => {
              this.row0 = calendar.rows[0];
              this.row1 = calendar.rows[1];
              this.row2 = calendar.rows[2];
              this.row3 = calendar.rows[3];
              this.row4 = calendar.rows[4];
              this.row5 = calendar.rows[5];
              this.row6 = calendar.rows[6];
              this.monthname = calendar.start.month.name;
              this.year = calendar.start.year;
          })
      
  }

  previous() {

    var queryString = DateFormat.urlString(--this.offset);
    return this.http.fetch('/calendar/index.json' + queryString)
          .then(response => response.json())
          .then(calendar => {
              this.row0 = calendar.rows[0];
              this.row1 = calendar.rows[1];
              this.row2 = calendar.rows[2];
              this.row3 = calendar.rows[3];
              this.row4 = calendar.rows[4];
              this.row5 = calendar.rows[5];
              this.row6 = calendar.rows[6];
              this.monthname = calendar.start.month.name;
              this.year = calendar.start.year;
          })
  }
  next() {
    var queryString = DateFormat.urlString(++this.offset);
    return this.http.fetch('/calendar/index.json' + queryString)
          .then(response => response.json())
          .then(calendar => {
              this.row0 = calendar.rows[0];
              this.row1 = calendar.rows[1];
              this.row2 = calendar.rows[2];
              this.row3 = calendar.rows[3];
              this.row4 = calendar.rows[4];
              this.row5 = calendar.rows[5];
              this.row6 = calendar.rows[6];

              this.monthname = calendar.start.month.name;
              this.year = calendar.start.year;
          })
  }

  
}