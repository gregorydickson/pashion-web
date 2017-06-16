import {DialogController} from 'aurelia-dialog';
import {HttpClient,json} from 'aurelia-fetch-client';
import 'fetch';
import {inject} from 'aurelia-framework';
import {DialogService} from 'aurelia-dialog';
import { CreateDialogAlert } from 'common/dialogAlert';
import { CityService } from 'services/cityService';


@inject(HttpClient, DialogController, DialogService, CityService)
export class CreateAddress {
  static inject = [DialogController];
  
  address = {};
  cities = [];
  
  constructor(http, controller, dialogService, cityService) {
    this.controller = controller;
    
    http.configure(config => {
      config
        .useStandardConfiguration();
    });
    this.http = http;
    this.dialogService = dialogService;
    this.cityService = cityService;
  }

  activate(brandId){
    address.brandId = brandId;
    // this.http.fetch('/dashboard/cities').then(response => response.json()).then(cities => this.cities = cities);
    this.cityService.getCities().then(cities => { this.cities = cities; });

  }

  alertP (message){

        this.dialogService.open({ viewModel: CreateDialogAlert, model: {title:"Address", message:message, timeout:5000}, lock:false }).then(response => {});
    }

  submit(){
    console.log("adding address to Brand");
    var item = this.address;
    
    this.http.fetch('/brand/addAddress', {
            method: 'post',
            body: json(item)
          })
          .then(response => response.json())
          .then(result => {
              this.result = result;
          });
    
    this.alertP("Updated");
    this.controller.close();
    
  }
}