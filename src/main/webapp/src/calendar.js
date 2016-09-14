import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import {DateFormat} from 'common/dateFormat';
import 'fetch';

@inject(HttpClient)
export class Calendar {
  
  calendar = [];
  
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
    var queryString = DateFormat.urlString(0,1);
    
    return this.http.fetch('/calendar/index.json' + queryString)
          .then(response => response.json())
          .then(calendar => {
              this.calendar = calendar;
              this.monthname = calendar.calendarMonths[0].monthName;
              this.year = calendar.calendarMonths[0].year;
          })
      
  }

  previous() {
    var queryString = DateFormat.urlString(--this.offset, 1);
    return this.http.fetch('/calendar/index.json' + queryString)
          .then(response => response.json())
          .then(calendar => {
              this.calendar = calendar;
              this.monthname = calendar.calendarMonths[0].monthName;
              this.year = calendar.calendarMonths[0].year;
          })
  }
  next() {
    var queryString = DateFormat.urlString(++this.offset,1);
    return this.http.fetch('/calendar/index.json' + queryString)
          .then(response => response.json())
          .then(calendar => {
              this.calendar = calendar;
              this.monthname = calendar.calendarMonths[0].monthName;
              this.year = calendar.calendarMonths[0].year;
          })
  }

  


}
