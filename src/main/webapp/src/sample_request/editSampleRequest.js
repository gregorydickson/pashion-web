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
  brandUsers = [];

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
          console.log("sampleRequest"+sampleRequest);
          this.http.fetch('/brand/addresses/'+sampleRequest.brand.id)
              .then(response => response.json())
              .then(addresses => this.brandAddresses = addresses);
          this.http.fetch('/brand/users/'+sampleRequest.brand.id)
              .then(response => response.json())
              .then(brandUsers => this.brandUsers = brandUsers);
        })
    ]);
    
    
  }

  removeSample(id,index){
    let sr = this.sampleRequest;
    if(!sr.samplesRemoved) sr.samplesRemoved = [];
    sr.samplesRemoved.push(id);
    sr.searchableItemsProposed.splice(index,1);
  }

  approve(){
    console.log("submitting Sample Request");
    let sr = this.sampleRequest;

    this.sampleRequestService.approveAndUpdateSampleRequest(sr).then(message => {
      alert(message.message);
      this.controller.close();
    });
    
  }

  update(){
    console.log("submitting Sample Request");
    let sr = this.sampleRequest;

    this.sampleRequestService.updateSampleRequest(sr).then(message => {
      alert(message.message);
      this.controller.close();
    });
    
  }

  cancel(){
    this.controller.close();
  }
}
