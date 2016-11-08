import {DialogController} from 'aurelia-dialog';
import {HttpClient,json} from 'aurelia-fetch-client';
import 'fetch';
import {inject} from 'aurelia-framework';


@inject(HttpClient, DialogController)
export class CreateAddress {
  static inject = [DialogController];
  
  address = {};
  cities = [];
  
  constructor(http, controller){
    this.controller = controller;
    
    http.configure(config => {
      config
        .useStandardConfiguration();
    });
    this.http = http;
  }

  activate(brandId){
    address.brandId = brandId;
    this.http.fetch('/dashboard/cities').then(response => response.json()).then(cities => this.cities = cities);
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
    
    alert("Updated");
    this.controller.close();
    
  }
}