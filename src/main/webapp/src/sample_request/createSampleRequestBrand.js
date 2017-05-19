import { DialogController } from 'aurelia-dialog';
import { HttpClient, json } from 'aurelia-fetch-client';
import 'fetch';
import { inject, bindable } from 'aurelia-framework';
import { DateFormat } from 'common/dateFormat';
import { BrandService } from 'services/brandService';
import { PRAgencyService } from 'services/PRAgencyService';
import { UserService } from 'services/userService';
import { DialogService } from 'aurelia-dialog';
import { CreateDialogAlert } from 'common/dialogAlert';
import $ from 'jquery';
import { computedFrom } from 'aurelia-framework';



@inject(HttpClient, DialogController, BrandService, DialogService, UserService, PRAgencyService)
export class CreateSampleRequestBrand {
  static inject = [DialogController];
  currentItem = {};
  startCalendar = {};
  endCalendar = {};
  isLoading = true;


  selectAll = true;
  required = [];

  availableReturnToItems = [];
  selectedReturnToItems = [''];
  sampleRequestStartMonth = '';
  sampleRequestStartDay = '';
  sampleRequestEndMonth = '';
  sampleRequestEndDay = '';

  @bindable user = {};
  
  @bindable restrictOutsideBooking = false;

  brand = [];

  returnBy = [];

  courier = [];
  payment = [];

  emailOptions = ['EMAIL'];
  email = null;

  selectedAddress = {};
  returnToAddress = null;


  sampleRequest = {};
  startOffset = 0;
  endOffset = 0;

  startDay = '';
  endDay = '';

  constructor(http, controller, brandService, dialogService,userService,PRAgencyService) {
    this.controller = controller;
    console.log("createSampleRequestBrand");
    http.configure(config => {
      config
        .useStandardConfiguration();
    });
    this.http = http;
    this.brandService = brandService;
    this.dialogService = dialogService;
    this.userService = userService;
    this.prAgencyService = PRAgencyService;
  }


   

    

  activate(item) {
    var queryString = DateFormat.urlString(0, 2) + '&searchType=brand';

    let sampleRequest = this.sampleRequest;
    this.sampleRequest.samples = [];
    let availableReturnToItems = this.availableReturnToItems;

    Promise.all([
      this.http.fetch('/calendar/searchableItemPicker' + queryString + '&item=' + item.id)
        .then(response => response.json())
        .then(calendar => {
          this.startCalendar = calendar;
          this.endCalendar = calendar;
        }),

      this.http.fetch('/dashboard/required').then(response => response.json()).then(required => {
        this.required = required;
        this.sampleRequest.requiredBy = "12:00";
      }),

      this.http.fetch('/dashboard/returnBy').then(response => response.json()).then(returnBy => {
        this.returnBy = returnBy;
        this.sampleRequest.returnBy = "Afternoon";
      }),
      this.http.fetch('/dashboard/courier').then(response => response.json()).then(courier => {
        this.courier = courier;
        this.sampleRequest.courierOut = "Pashion Courier";
        this.sampleRequest.courierReturn = "They Book";

      }),

      this.http.fetch('/dashboard/payment').then(response => response.json()).then(payment => {
        this.payment = payment;
        this.sampleRequest.paymentOut = "50/50";
        this.sampleRequest.paymentReturn = "50/50";
      }),

      

      this.http.fetch('/dashboard/seasons').then(response => response.json()).then(seasons => this.seasons = seasons),

      this.http.fetch('/searchableItems/' + item.id + '.json')
        .then(response => response.json())
        .then(item => {
          this.currentItem = item;

          this.userService.getUser().then(user => {
            this.user = user;
            if (user.type=="brand"){
              this.brandService.getRestrictOutsideBooking(this.user.brand.id).then(result => {
                console.log("restrict Outside booking:"+result)
                this.restrictOutsideBooking = result;
                var theUser = this.user;

                var ids = this.sampleRequest.samples;
                item.samples.forEach(function (item,index,object) {
                  if(result){
                    if(item.sampleCity.name == theUser.city.name ){
                      ids.push(item.id);
                    } else {
                      console.log("not adding to selected");
                    }
                  } else {
                    ids.push(item.id);
                  }
                  
                })

              });
            }
            if (user.type=="prAgency"){
              this.prAgencyService.getRestrictOutsideBooking(this.user.prAgency.id).then(result =>{ 
                this.restrictOutsideBooking = result;
                var theUser = this.user;

                var ids = this.sampleRequest.samples;
                item.samples.forEach(function (item,index,object) {
                  if(result){
                    if(item.sampleCity.name == theUser.city.name ){
                      ids.push(item.id);
                    } 
                  } else {
                    ids.push(item.id);
                  }
                  
                })
              });
            }
          })


          //
          this.brandService.getBrandAddresses(item.brand.id).then(addresses => {
            this.returnTo = addresses;

            addresses.forEach(item => {
              this.availableReturnToItems.push({
                id: item.id,
                text: item.name
              });
            });

            let defaultAddress = addresses.find(item => item.defaultAddress == true);
            if (defaultAddress) {
              let selectedReturnTo = availableReturnToItems.find(item => item.id == defaultAddress.id);
              sampleRequest.returnToAddress = selectedReturnTo.id;
              this.selectedReturnToItems = [selectedReturnTo.id];
            }



          }),
          
          this.brandService.getBrand(item.brand.id).then(brand => {
            this.brand = brand;
          });
          
          

        })
    ]).then(() => {
      this.isLoading = false


    });
  }

  onSelectAddressChangeCallback(event) {
    console.log('onSelectAddressChangeCallback() called:', event.detail.value);
    if (event.detail.value.selectedAddress) {
      this.selectedAddress = event.detail.value.selectedAddress;
    }
    this.enableCheck();
  }

  onReturnToChangeCallback(event) {
    console.log('onReturnToChangeCallback() called:', event.detail.value);

    if (event.detail.value) {
      let selectedReturnToId = event.detail.value;
      let selectedReturnTo = this.returnTo.find(item => item.id == selectedReturnToId);
      console.log('Selected returnTo:', selectedReturnTo);
      this.sampleRequest.returnToAddress = selectedReturnToId;


    }
    this.enableCheck();
  }


  attached() {
    document.getElementById("CreateSampleRequestButton").disabled = true;
  }

  alertP(message) {
    this.dialogService.open({ viewModel: CreateDialogAlert, model: { title: "Booking", message: message, timeout: 5000 }, lock: false }).then(response => { });
  }

  setStartDate(event, dayEvent, day) {
    console.log("set start date: " + event);
    console.log("parameterday: " + day);

    var today = new Date();
    this.startDay = day;
    var enddate = '';
    if (this.endDay != '') enddate = new Date(this.endCalendar.calendarMonths[0].year, this.endCalendar.calendarMonths[0].monthNumber - 1, this.endDay);
    let startdate = new Date(this.startCalendar.calendarMonths[0].year, this.startCalendar.calendarMonths[0].monthNumber - 1, day);

    // quit if in the past
    // could also add in here, any business logic about if we want to book +1 day out?
    console.log("today: " + today);
    console.log("startdate: " + startdate);
    console.log("startDay: " + this.startDay);
    if (this.endDay != '') console.log("enddate: " + enddate); else console.log("no endDay set")
    console.log("endDay: " + this.endDay);
    if (startdate <= today) {
      console.log("day is before today or is today, exit");
      this.startDay = '';
      this.sampleRequest.startDate = '';
      this.sampleRequestStartMonth = '';
      this.sampleRequestStartDay = '';
      // also clear end date
      this.endDay = '';
      this.sampleRequest.endDate = '';
      this.sampleRequestEndDay = '';
      this.sampleRequestEndMonth = '';
      this.enableCheck();
      return;
    }
    console.log("day is in the future");

    //check availability
    var dayIsNotAvailable = dayEvent.indexOf("not-available") >= 0;
    console.log("setStartDate, calendar day contains unavailable: " + dayIsNotAvailable);
    if (dayIsNotAvailable) {
      this.startDay = '';
      this.sampleRequest.startDate = '';
      this.sampleRequestStartMonth = '';
      this.sampleRequestStartDay = '';
      // also clear end date
      this.endDay = '';
      this.sampleRequest.endDate = '';
      this.sampleRequestEndDay = '';
      this.sampleRequestEndMonth = '';
      this.enableCheck();
      return;
    }

    if (this.endDay != '') {
      console.log("setting start date END DATE not empty");
      if (enddate < startdate) {
        console.log("setting start date AND it is after end date");
        this.endDay = '';
        this.sampleRequest.endDate = '';
        this.sampleRequestEndDay = '';
        this.sampleRequestEndMonth = '';
        this.enableCheck();
        //let element = event.srcElement.parentElement;
        //let document = element.ownerDocument;
        //let elems = document.querySelectorAll(".end-selected");
        //var redraw = this.redraw;
        //[].forEach.call(elems, function(el) {
        //  if(el.classList.contains("end-selected")){
        //   el.classList.remove("end-selected");
        //   redraw(el);
        // }
        //});
      }
    }
    //var element = event.srcElement;
    //console.log ("createSampleRequestBrand: " + element);
    //var document = element.ownerDocument;
    //var elems = document.querySelectorAll(".start-selected");
    //[].forEach.call(elems, function(el) {
    //  el.classList.remove("start-selected");
    //});
    //element.className = " start-selected";
    //this.redraw(element);
    this.sampleRequest.startDate = this.startCalendar.calendarMonths[0].year + "-" + this.startCalendar.calendarMonths[0].monthNumber + "-" + day;
    this.sampleRequestStartMonth = this.startCalendar.calendarMonths[0].monthNumber;
    this.sampleRequestStartDay = day;
    this.enableCheck();
  }

  @computedFrom('startCalendar.calendarMonths[0].monthNumber', 'sampleRequestStartMonth')
  get computedClass() {
    if (this.startCalendar.calendarMonths[0].monthNumber == this.sampleRequestStartMonth) return true
  }

  @computedFrom('endCalendar.calendarMonths[0].monthNumber', 'sampleRequestEndMonth')
  get computedClassEnd() {
    if (this.endCalendar.calendarMonths[0].monthNumber == this.sampleRequestEndMonth) return true
  }


  setEndDate(event, dayEvent, day) {
    this.endDay = day;
    var startdate = '';
    let enddate = new Date(this.endCalendar.calendarMonths[0].year, this.endCalendar.calendarMonths[0].monthNumber - 1, day);
    if (this.startDay != '') startdate = new Date(this.startCalendar.calendarMonths[0].year, this.startCalendar.calendarMonths[0].monthNumber - 1, this.startDay);
    var today = new Date();

    console.log("today: " + today);
    if (this.startDay != '') console.log("startDay: " + this.startDay);
    else {
      console.log("no startDay set, exit");
      this.endDay = '';
      this.sampleRequest.endDate = '';
      this.sampleRequestEndDay = '';
      this.sampleRequestEndMonth = '';
      this.enableCheck();
      return;
    }
    console.log("startdate: " + startdate);
    console.log("enddate: " + enddate);
    console.log("endDay: " + this.endDay);
    if (enddate <= today) {
      console.log("day is before today or is today, exit");
      this.endDay = '';
      this.sampleRequest.endDate = '';
      this.sampleRequestEndDay = '';
      this.sampleRequestEndMonth = '';
      this.enableCheck();
      return;
    }
    console.log("day is in the future");

    if (this.startDay === '' || enddate < startdate || enddate.getTime() == startdate.getTime()) {
      console.log(" empty, reverse or time clash");
      this.endDay = '';
      this.sampleRequest.endDate = '';
      this.sampleRequestEndDay = '';
      this.sampleRequestEndMonth = '';
      this.enableCheck();
      return;
    }

    //check availability
    var dayIsNotAvailable = dayEvent.indexOf("not-available") >= 0;
    console.log("setEndDate, calendar day contains unavailable: " + dayIsNotAvailable);
    if (dayIsNotAvailable) {
      this.endDay = '';
      this.sampleRequest.endDate = '';
      this.sampleRequestEndDay = '';
      this.sampleRequestEndMonth = '';
      this.enableCheck();
      return;
    }

    console.log("end date" + event);
    console.log("day" + day);
    //let element = event.srcElement.parentElement;
    //let document = element.ownerDocument;
    //let elems = document.querySelectorAll(".end-selected");
    //[].forEach.call(elems, function(el) {
    //el.classList.remove("end-selected");
    //});
    //element.className += " end-selected";
    //this.redraw(element);
    this.sampleRequest.endDate = this.endCalendar.calendarMonths[0].year + "-" + this.endCalendar.calendarMonths[0].monthNumber + "-" + day;
    this.sampleRequestEndMonth = this.endCalendar.calendarMonths[0].monthNumber;
    this.sampleRequestEndDay = day;
    this.enableCheck();

  }

  enableCheck() {

    if ((this.sampleRequest.samples === undefined) ||
      (this.sampleRequest.samples.length == 0) ||
      (this.sampleRequest.startDate === undefined) ||
      (this.sampleRequest.startDate == '') ||
      (this.sampleRequest.endDate === undefined) ||
      (this.selectedAddress.name === undefined) ||
      (this.sampleRequest.returnToAddress === undefined) ||
      (this.sampleRequest.endDate == '')) {
      document.getElementById("CreateSampleRequestButton").disabled = true;
      console.log("button DIS abled");
    } else {
      document.getElementById("CreateSampleRequestButton").disabled = false;
      console.log("button ENabled");
    }
  }


  redraw(element) {
    element.style.display = 'none';
    element.offsetHeight;
    element.style.display = '';
  }

  startNext(){
    ++this.startOffset;
    this.updateAvailability();
  }
  startPrevious() {
    --this.startOffset;
    this.updateAvailability();
  }
  startReset() {
    this.startOffset = 0;
    this.updateAvailability();
  }
  endNext() {
    ++this.endOffset;
    this.updateAvailability();
  }
  endPrevious() {
    --this.endOffset;
    this.updateAvailability();
  }
  endReset() {
    this.endOffset = 0;
    this.updateAvailability();
  }

  allsamples(event) {
    console.log("all samples" + event.srcElement.checked);
    if (event.srcElement.checked) {
      for (var i = 0, len = this.currentItem.samples.length; i < len; i++) {
        if (!(this.sampleRequest.samples.includes(this.currentItem.samples[i].id))) {
          this.sampleRequest.samples.push(this.currentItem.samples[i].id);
        }
      }

    } else {
      this.sampleRequest.samples = [];
      document.getElementById("CreateSampleRequestButton").disabled = true;
    }
    this.enableCheck();
  }


  updateAvailability() {
    this.allSamplesSelected();
    if (this.sampleRequest.samples.length == 0) {
      console.log("no samples");
      document.getElementById("CreateSampleRequestButton").disabled = true;
    } else {

      var queryString = DateFormat.urlString(this.endOffset, 1) + '&searchType=brand';
      this.http.fetch('/calendar/showAvailabilitySamples' + queryString, {
        method: 'post',
        body: json(this.sampleRequest.samples)
      })
        .then(response => response.json())
        .then(calendar => {
          this.endCalendar = calendar;
        });

      queryString = DateFormat.urlString(this.startOffset, 1) + '&searchType=brand';
      this.http.fetch('/calendar/showAvailabilitySamples' + queryString, {
        method: 'post',
        body: json(this.sampleRequest.samples)
      })
        .then(response => response.json())
        .then(calendar => {
          this.startCalendar = calendar;
        });
    }

  }

  allSamplesSelected() {
    let samplesSelected = this.sampleRequest.samples;
    let samples = this.currentItem.samples;

    if (samples.length != samplesSelected.length) {
      this.selectAll = false;
      console.log("length not equal");
      //return;
    } else {
      this.selectAll = true;
    }
    this.enableCheck();
  }

  submit() {

    this.sampleRequest.deliverTo = this.selectedAddress;
    console.log("submitting Sample Request: " + JSON.stringify(this.sampleRequest));
    this.http.fetch('/sampleRequest/savejson', {
      method: 'post',
      body: json(this.sampleRequest)
    })
      .then(response => response.json())
      .then(result => {
        this.result = result;
        this.alertP('Request Sent');
        this.controller.ok();

      });

  }

  close() {
    this.controller.close();
  }

}