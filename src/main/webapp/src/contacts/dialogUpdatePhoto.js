import {DialogController} from 'aurelia-dialog';
import {HttpClient,json} from 'aurelia-fetch-client';
import 'fetch';
import {inject,bindable} from 'aurelia-framework';
import {DateFormat} from 'common/dateFormat';
import { UserService } from 'services/userService';

@inject(HttpClient, DialogController, UserService)
export class CreateDialogUpdatePhoto {
  static inject = [DialogController];

  flashMessage = '';
  @bindable avatar = null;

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
      var controller = this.controller;
      this.flashMessage = '';

    if(this.avatar){
        console.log("this has an avatar");
        if(this.avatar[0].type.indexOf('image/')!=-1){
          console.log("the file type of avatar is image");
          var reader = new FileReader();
          reader.readAsDataURL(this.avatar[0]);
           
          reader.onload = function () {
                
                data = reader.result;
                
                current.userService.uploadAvatar(data)
                  .then(data => {
                    console.log('URL ' + data.url);
                    console.log("close controller");
                    controller.close();
                  }).catch(function (err) {
                    console.log(err);
                    current.flashMessage = 'Incompatible File Type'
                    var parent = current;
                    setTimeout(function() { parent.flashMessage=''; }, 5000)
                  });
          }
            
          
          reader.onerror = function (error) {
              console.log('Error: ', error);
          };
          console.log('waiting');
        } else{
            //this.alertP('Sorry, we only can accept images files');
            // alert('Sorry, we only can accept images files');
            this.flashMessage = 'Image Files Only'
            var parent = this;
            setTimeout(function() { parent.flashMessage=''; }, 5000)
        }


    } else {
      console.log('Selected image successfully');
    }    
  }


  close(){
    this.controller.close();
  }

  delete (){
    // clear user.avatar
    // save null to user record
    this.userService.getUser().then(user => {
        this.user = user;
        this.user.avatar = '';
        this.userService.clearAvatar(user);
        this.close();
      })
  }

  clearMessage () {
    this.flashMessage ='';
    console.log("flashMessage cleared");
  }

  attached() {
    
    var inputs = document.querySelectorAll( '.input-file' );
    Array.prototype.forEach.call( inputs, function(input) {
      var label  = input.nextElementSibling,
        labelVal = label.innerHTML;

        // Fit width of file input and label
        input.style.width = label.offsetWidth + "px";

        //var parent = this;
        input.addEventListener( 'change', function(e) {


            var fileName = '';
            if( this.files && this.files.length > 1 )
              fileName = ( this.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', this.files.length );
            else
              fileName = e.target.value.split( '\\' ).pop();

            if( fileName ){
              console.log("disable bind with filename");
              label.querySelector( 'span' ).innerHTML = fileName;
              
            }else
              label.innerHTML = labelVal;

          // Make width of file input and label the same
            input.style.width = label.offsetWidth + "px";
    
        });


    });



  }
  
}