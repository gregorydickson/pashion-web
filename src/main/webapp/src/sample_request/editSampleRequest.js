import {DialogController} from 'aurelia-dialog';
import {HttpClient} from 'aurelia-fetch-client';
import 'fetch';
import {inject} from 'aurelia-framework';
import {DateFormat} from 'common/dateFormat';
import {SampleRequestService} from 'services/sampleRequestService';
import {UserService} from 'services/userService';

@inject(SampleRequestService, DialogController,UserService, HttpClient)
export class EditSampleRequest {
	static inject = [DialogController];

  sampleRequest = {};
  brandAddresses = [];
  user = {};

  constructor(sampleRequestService,controller,userService,http){
    http.configure(config => {
      config
        .useStandardConfiguration();
    });
    this.http = http;
    this.controller = controller;
    this.sampleRequestService = sampleRequestService;
    this.userService = userService;
  }

  activate(requestId){
    return Promise.all([
      this.user = this.userService.getUser().then(user => this.user = user),
      this.sampleRequestService.getSampleRequest(requestId)
        .then(sampleRequest => {
          this.sampleRequest = sampleRequest;
          this.http.fetch('/brand/addresses/'+sampleRequest.brand.id)
              .then(response => response.json())
              .then(addresses => this.brandAddresses = addresses)
          }),
        ]);
    
    
  }

  submit(){
    console.log("submitting Sample Request");
    var sr = this.sampleRequest;
    sr.startDate = this.startDate;
    sr.endDate = this.endDate;
    sr.selectedRequired = this.selectedRequired;
    sr.deliverToSelected = this.deliverToSelected;
    sr.returnBySelected = this.returnBySelected;
    sr.returnToSelected = this.returnToSelected;
    sr.selectedProductIds = this.selectedProductIds;
    
    this.currentItem.id = this.result;
    alert('Request Sent');
    this.controller.close();
    
  }

  cancel(){
    this.controller.close();
  }
}
