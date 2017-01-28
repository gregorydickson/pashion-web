import {DialogController} from 'aurelia-dialog';
import {HttpClient,json} from 'aurelia-fetch-client';
import 'fetch';
import {inject} from 'aurelia-framework';
import {DateFormat} from 'common/dateFormat';
import { UserService } from 'services/userService';

@inject(HttpClient, DialogController, UserService)
export class CreateDialogUpdatePhoto {
  static inject = [DialogController];

  constructor(http, controller, userService){
    this.controller = controller;
    this.userService = userService;

    http.configure(config => {
      config
        .useStandardConfiguration();
    });
    this.http = http;
  }

  uploadAvatar() {

    console.log(this.avatar);

    if(this.avatar != undefined){
      var form = new FormData()
      form.append('file', this.avatar)

      this.userService.getUser()
        .then(user => {
          this.user = user;
          this.userService.uploadAvatar(this.user, form)
            .then(data => {
              console.log('URL ' + data.url);
              this.controller.close();
              });
          });
    } else {
      console.log('Selected image successfully');
    }    
  }

  activate(itemId){
   /* this.http.fetch('/searchableItems/'+itemId+'.json')
         .then(response => response.json())
         .then(item => {}
         );*/
  }

  close(){
    this.controller.close();
  }

  attached() {
 
    var inputs = document.querySelectorAll( '.input-file' );
    Array.prototype.forEach.call( inputs, function(input) {
      var label  = input.nextElementSibling,
        labelVal = label.innerHTML;

        // Fit width of file input and label
        input.style.width = label.offsetWidth + "px";

        input.addEventListener( 'change', function(e) {

          // Add to styled file input count feature
            var fileName = '';
            if( this.files && this.files.length > 1 )
              fileName = ( this.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', this.files.length );
            else
              fileName = e.target.value.split( '\\' ).pop();

            if( fileName )
              label.querySelector( 'span' ).innerHTML = fileName;
            else
              label.innerHTML = labelVal;

          // Make width of file input and label the same
            input.style.width = label.offsetWidth + "px";
    
        });


    });



  }
  
}