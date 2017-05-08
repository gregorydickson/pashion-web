import { DialogController } from 'aurelia-dialog';
import { HttpClient } from 'aurelia-fetch-client';
import 'fetch';
import { inject } from 'aurelia-framework';
import { DateFormat } from 'common/dateFormat';
import { SampleRequestService } from 'services/sampleRequestService';
import { DS } from 'datastores/ds';
import { CreateDialogAlert } from 'common/dialogAlert';
import { DialogService } from 'aurelia-dialog';
import moment from 'moment'
import { busy } from 'services/busy';


@inject(SampleRequestService, DialogController, DS, HttpClient, DialogService, busy)
export class EditSampleRequest {
  static inject = [DialogController];

  sampleRequest = {};
  brandAddresses = [];
  user = {};
  brandUsers = [];
  //seasons = [];
  courier = [];
  payment = [];
  times = [];

  constructor(sampleRequestService, controller, DS, http, DialogService, busy) {
    http.configure(config => {
      config
        .useStandardConfiguration();
    });
    this.http = http;
    this.controller = controller;
    this.sampleRequestService = sampleRequestService;
    this.ds = DS;
    this.dialogService = DialogService;
    this.busy = busy;
  }

  activate(requestId) {


    return Promise.all([
      this.sampleRequestService.getSampleRequest(requestId).then(sampleRequest => {
        this.sampleRequest = sampleRequest;
        console.log(JSON.stringify(sampleRequest));
      }),
      this.http.fetch('/dashboard/courier').then(response => response.json()).then(courier => {
        this.courier = courier;
        this.sampleRequest.courierOut = "They Book"; //RM Defaults not working
        this.sampleRequest.courierReturn = "Pashion Courier";  //RM defaults not working
      }),
      this.http.fetch('/dashboard/payment').then(response => response.json()).then(payment => {
        this.payment = payment;
        this.sampleRequest.paymentOut = "50/50";
        this.sampleRequest.paymentReturn = "50/50";
      }),
      this.http.fetch('/dashboard/seasons').then(response => response.json()).then(seasons => this.seasons = seasons),
      this.http.fetch('/dashboard/times').then(response => response.json()).then(times => this.times = times)
    ]);

  }

  attached() {

    this.user = this.ds.user.user;
    this.http.fetch('/brand/addresses/' + this.sampleRequest.brand.id)
      .then(response => response.json())
      .then(addresses => this.brandAddresses = addresses);
    this.http.fetch('/brand/users/' + this.sampleRequest.brand.id)
      .then(response => response.json())
      .then(brandUsers => this.brandUsers = brandUsers);
    if(this.sampleRequest.shippingOut.stuartJobId)
      document.getElementById('bookOut').style.visibility = 'hidden';
    if(this.sampleRequest.shippingReturn.stuartJobId)
      document.getElementById('bookReturn').style.visibility = 'hidden';


  }

  onSelectAddressChangeCallback(event) {
    console.log('onSelectAddressChangeCallback() called:', event.detail.value);
    if (event.detail.value.selectedAddress) {
      this.sampleRequest.addressDestination = event.detail.value.selectedAddress;
    }
  }

  bookOut() {
    // initiate stuart booking
    if (!(this.sampleRequest.pickupDate) ||
      !(this.sampleRequest.pickupTime) ||
      !(this.sampleRequest.addressDestination)) {
      this.alertP("Please pick a Date and Time and Address");
      return
    }
    this.busy.on();
    console.log("Initiate Stuart booking from editSampleRequest Out");
    document.getElementById('bookOut').style.visibility = 'hidden';
    this.sampleRequestService.bookOutSampleRequest(this.sampleRequest).then(sr => {
      this.sampleRequestService.getSampleRequest(this.sampleRequest.id).then(sampleRequest => {
        this.sampleRequest = sampleRequest;
        this.busy.off();
        this.alertP(sr.message);
        document.getElementById('bookOut').style.visibility = 'visible';
      });
    });

  }

  bookReturn() {
    // initiate stuart booking
    if (!(this.sampleRequest.pickupDateReturn) || !(this.sampleRequest.pickupTimeReturn)) {
      this.alertP("Please pick a Date and Time");
      return
    }
    this.busy.on();
    document.getElementById('bookReturn').style.visibility = 'hidden';
    console.log("Initiate Stuart booking from editSampleRequest Return");
    this.sampleRequestService.bookReturnSampleRequest(this.sampleRequest).then(sr => {
      this.sampleRequestService.getSampleRequest(this.sampleRequest.id).then(sampleRequest => {
        this.sampleRequest = sampleRequest;
        this.busy.off();
        this.alertP(sr.message);
        document.getElementById('bookReturn').style.visibility = 'visible';
      });
    });

  }

  alertP(message) {
    this.dialogService.open({ viewModel: CreateDialogAlert, model: { title: "Edit Request", message: message, timeout: 5000 }, lock: false }).then(response => { });
  }

  removeSample(id, index) {
    let sr = this.sampleRequest;
    if (!sr.samplesRemoved) sr.samplesRemoved = [];
    sr.samplesRemoved.push(id);
    sr.searchableItemsProposed.splice(index, 1);
  }

  approve() {
    console.log("Approve: submitting Sample Request");
    let sr = this.sampleRequest;

    this.sampleRequestService.approveAndUpdateSampleRequest(sr).then(message => {
      this.alertP(message.message);
      this.controller.close();
    });

  }

  deny() {
    console.log("Deny: submitting Sample Request");
    let sr = this.sampleRequest;

    this.sampleRequestService.denySampleRequest(sr.id).then(message => {
      this.alertP(message.message);
      this.controller.close();
    });

  }

  deleteRequestBrand() {
    let sr = this.sampleRequest;
    console.log("Delete Brand: submitting Sample Request: " + sr.id);

    this.sampleRequestService.deleteSampleRequest(sr.id).then(message => {
      this.alertP(message.message);
      this.controller.close();
    });

  }

  deleteRequestPress() {
    let sr = this.sampleRequest;
    console.log("Delete Press: submitting Sample Request: " + sr.id);

    this.sampleRequestService.pressDeleteSampleRequest(sr.id).then(message => {
      this.alertP(message.message);
      this.controller.close();
    });

  }


  update() {
    console.log("Update: submitting Sample Request");
    let sr = this.sampleRequest;
    /*if(sr.shippingOut.startDate)
      sr.shippingOut.startDate = moment(sr.shippingOut.startDate).format('YYYY-MM-DD hh:mm')
    if(sr.shippingReturn.endDate)
      sr.shippingReturn.endDate = moment(sr.shippingReturn.endDate).format('YYYY-MM-DD hh:mm')
    */
    this.sampleRequestService.updateSampleRequest(sr).then(message => {
      this.controller.close();
    });

  }

  cancel() {
    this.controller.close();
  }
}
