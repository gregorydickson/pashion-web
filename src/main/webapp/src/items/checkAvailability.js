import { DialogController } from 'aurelia-dialog';
import { HttpClient, json } from 'aurelia-fetch-client';
import 'fetch';
import { inject } from 'aurelia-framework';
import { DateFormat } from 'common/dateFormat';
import { UserService } from 'services/userService';
import { BrandService } from 'services/brandService';
import { OutReasonService } from 'services/outReasonService';

@inject(HttpClient, DialogController, UserService, BrandService,  OutReasonService)
export class CheckAvailability {
  static inject = [DialogController];

  currentItem = {};
  calendar = {};
  offset = 0;
  startDate = "";
  selectedProductIds = [];
  selectAll = true;
  brandHideCalendar = false;


  constructor(http, controller, userService, brandService, outReasonService) {
    this.controller = controller;

    http.configure(config => {
      config
        .useStandardConfiguration();
    });
    this.http = http;
    this.userService = userService;
    this.brandService = brandService;
    this.outReasonService = outReasonService;
  }

  activate(itemId) {
    this.http.fetch('/searchableItems/' + itemId + '.json')
      .then(response => response.json())
      .then(item => {
        this.currentItem = item;
        this.brandService.getHideCalendar(this.currentItem.brand.id).then(HD => {
          this.brandHideCalendar = HD;
          console.log("brandHideCalendar: " + this.brandHideCalendar);
        });
        var ids = this.selectedProductIds;
        item.samples.forEach(function (item) {
          ids.push(item.id);
        })

        this.userService.getUser().then(user =>{

          this.user = user;
          var queryString = DateFormat.urlString(0, 1);
          if (this.user.type === "brand")
            queryString = queryString + '&searchType=brand';

          this.http.fetch('/calendar/showAvailabilitySamples' + queryString, {
            method: 'post',
            body: json(this.selectedProductIds)
          })
            .then(response => response.json())
            .then(calendar => {
              this.calendar = calendar;
            });

        });

        
      });

      this.http.fetch('/dashboard/seasons').then(response => response.json()).then(seasons => this.seasons = seasons);

      this.outReasonService.getOutReasons().then(outReasons => {
        this.outReasons = outReasons.map(value => {return {id: value.id, name:value.name.toUpperCase()};});});

  }

  next() {
    var queryString = DateFormat.urlString(++this.offset, 1);
    if (this.user.type === "brand")
      queryString = queryString + '&searchType=brand';
    this.http.fetch('/calendar/showAvailabilitySamples' + queryString, {
      method: 'post',
      body: json(this.selectedProductIds)
    })
      .then(response => response.json())
      .then(calendar => {
        this.calendar = calendar;
      });
  }

  previous() {
    var queryString = DateFormat.urlString(--this.offset, 1);
    if (this.user.type === "brand")
      queryString = queryString + '&searchType=brand';

    this.http.fetch('/calendar/showAvailabilitySamples' + queryString, {
      method: 'post',
      body: json(this.selectedProductIds)
    })
      .then(response => response.json())
      .then(calendar => {
        this.calendar = calendar;
      });
  }

  reset() {
    console.log("CheckAvailability, reset called");
    this.offset = 0;
    var queryString = DateFormat.urlString(0, 1);
    if (this.user.type === "brand")
      queryString = queryString + '&searchType=brand';
    this.http.fetch('/calendar/showAvailabilitySamples' + queryString, {
      method: 'post',
      body: json(this.selectedProductIds)
    })
      .then(response => response.json())
      .then(calendar => {
        this.calendar = calendar;
      });
  }

  allsamples(event) {
    console.log("all samples" + event.srcElement.checked);
    if (event.srcElement.checked) {
      for (var i = 0, len = this.currentItem.samples.length; i < len; i++) {
        if (!(this.selectedProductIds.includes(this.currentItem.samples[i].id))) {
          this.selectedProductIds.push(this.currentItem.samples[i].id);
        }
      }
    } else {
      this.selectedProductIds = [];
      //document.getElementById("CreateSampleRequestButton").disabled = true;
    }   
    this.updateAvailability();
  }

  allSamplesSelected() {
    let samplesSelected = this.selectedProductIds;
    let samples = this.currentItem.samples;

    if (samples.length != samplesSelected.length) {
      this.selectAll = false;
      console.log("length not equal");
      //return;
    } else {
      this.selectAll = true;
    }
    //this.enableCheck();
  }

  get aSampleHasOutReason() {
    for (let sample of this.currentItem.samples) {
      if (sample.outReason) {
        if ((sample.outReason.id != 0) && (this.selectedProductIds.indexOf(sample.id) > -1)) {
          return true
        }
      } 
    }
    return false
  }


  updateAvailability() {
    this.allSamplesSelected();
    console.log("update availability");
    console.log("current item samples:" + this.currentItem.samples);
    console.log(this.selectedProductIds);
    var queryString = DateFormat.urlString(this.offset, 1);
    if (this.user.type === "brand")
      queryString = queryString + '&searchType=brand';
    this.http.fetch('/calendar/showAvailabilitySamples' + queryString, {
      method: 'post',
      body: json(this.selectedProductIds)
    })
      .then(response => response.json())
      .then(calendar => {
        this.calendar = calendar;
      });
  }

  close() {

    this.controller.close();

  }


}