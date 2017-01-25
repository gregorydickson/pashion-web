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
    
      
      return this.sampleRequestService.getSampleRequest(requestId).then(sampleRequest => {this.sampleRequest = sampleRequest;});
    
    
  }

  attached(){
    
    this.user = this.userService.getUser().then(user => this.user = user);
    this.http.fetch('/brand/addresses/'+this.sampleRequest.brand.id)
        .then(response => response.json())
        .then(addresses => this.brandAddresses = addresses);
    this.http.fetch('/brand/users/'+this.sampleRequest.brand.id)
        .then(response => response.json())
        .then(brandUsers => this.brandUsers = brandUsers);
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

  deny(){
    console.log("submitting Sample Request");
    let sr = this.sampleRequest;

    this.sampleRequestService.denySampleRequest(sr.id).then(message => {
      alert(message.message);
      this.controller.close();
    });

  }

  deleteRequestBrand(){
    console.log("submitting Sample Request");
    let sr = this.sampleRequest;

    this.sampleRequestService.deleteSampleRequest(sr.id).then(message => {
      alert(message.message);
      this.controller.close();
    });

  }
  
  deleteRequestPress(){
    console.log("submitting Sample Request");
    let sr = this.sampleRequest;

    this.sampleRequestService.pressDeleteSampleRequest(sr.id).then(message => {
      alert(message.message);
      this.controller.close();
    });

  }

  update(){
    console.log("submitting Sample Request");
    let sr = this.sampleRequest;

    this.sampleRequestService.updateSampleRequest(sr).then(message => {
      this.controller.close();
    });
    
  }

  cancel(){
    this.controller.close();
  }
}
