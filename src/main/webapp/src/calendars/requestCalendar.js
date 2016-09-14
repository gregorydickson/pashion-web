import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import {DateFormat} from 'common/dateFormat';
import 'fetch';

@inject(HttpClient)
export class RequestCalendar{
  calendar = [];
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
    var queryString = DateFormat.urlString(0, 2);
    
    return this.http.fetch('/calendar/index.json' + queryString)
          .then(response => response.json())
          .then(calendar => {
              this.calendar = calendar;
          })
      
  }

  previous() {

    var queryString = DateFormat.urlString(--this.offset,2);
    return this.http.fetch('/calendar/index.json' + queryString)
          .then(response => response.json())
          .then(calendar => {
              this.calendar = calendar;
          })
  }
  next() {
    var queryString = DateFormat.urlString(++this.offset,2);
    return this.http.fetch('/calendar/index.json' + queryString)
          .then(response => response.json())
          .then(calendar => {
              this.calendar = calendar;
          })
  }

  
}