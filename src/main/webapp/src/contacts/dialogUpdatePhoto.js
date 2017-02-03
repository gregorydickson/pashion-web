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
      var data = '';
      var current = this;

    if(this.avatar != undefined){

        console.log(this.avatar);
        var reader = new FileReader();
        reader.readAsDataURL(this.avatar[0]);
        reader.onload = function () {
            data = reader.result;
            current.userService.getUser()
                .then(user => {
                current.user = user;
            current.userService.uploadAvatar(current.user, data)
                .then(data => {
                console.log('URL ' + data.url);
                if (($('.avatar-container').children().attr('class')).indexOf("avatar-img")!= -1){
                    $('.avatar-img').attr('src', data.url);
                }else {
                    $('.avatar-container').html("<img src='"+data.url+"' class='clip-circle contact-entry avatar-img' />");
                    //quitar avatar-text y agregar avatar-img
                }

            current.controller.close();
        });
        });
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
        console.log('waiting');
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