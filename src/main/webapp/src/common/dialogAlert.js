import {DialogController} from 'aurelia-dialog';
import {HttpClient,json} from 'aurelia-fetch-client';
import 'fetch';
import {inject} from 'aurelia-framework';
import {DateFormat} from 'common/dateFormat';

@inject(HttpClient, DialogController)
export class CreateDialogAlert  {
  static inject = [DialogController];

  userForDeletion = '';

  constructor(http, controller){
    this.controller = controller;

    http.configure(config => {
      config
        .useStandardConfiguration();
    });
    this.http = http;
  }

  activate(inputs){
   /* this.http.fetch('/searchableItems/'+itemId+'.json') 
         .then(response => response.json())
         .then(item => {}
         ); */
    this.alertTitle = "Information";
    if (inputs.title != '') this.alertTitle=inputs.title;
    this.alertMessage=inputs.message;
    //this.timeOutMSecs = 5000;
    if (inputs.timeout && inputs.timeout == 'none') {}
    else {
      if (inputs.timeout && inputs.timeout != ''){
        var parent = this;
        setTimeout(function() { parent.controller.close(false) }, inputs.timeout);
      }
      if (!inputs.timeout){
        var parent = this;
        setTimeout(function() { parent.controller.close(false) }, 5000);
      }
    }

  }

  close(){
    this.controller.close(false);
  }

  confirm() {
    this.controller.close(true);
  }
  
}