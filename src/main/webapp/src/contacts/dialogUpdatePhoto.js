import {DialogController} from 'aurelia-dialog';
import {HttpClient,json} from 'aurelia-fetch-client';
import 'fetch';
import {inject} from 'aurelia-framework';
import {DateFormat} from 'common/dateFormat';
import { UserService } from 'services/userService';

@inject(HttpClient, DialogController, UserService)
export class CreateDialogUpdatePhoto {
  static inject = [DialogController];

  flashMessage = '';

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
      this.flashMessage = '';

    if(this.avatar != undefined){

        if(this.avatar[0].type.indexOf('image/')!=-1){
          $('#button-accept')[0].disabled = true;
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
                    $('.avatar-container')
                    .html('<div class="avatar-img-cover" style="height: 45px;border-radius: 100%;overflow:hidden;background: url('+data.url+'?_='+new Date().getTime()+');background-repeat: no-repeat;background-size: cover;background-position: center;display: block;width: 45px;"></div>');

                current.controller.close();
            }).catch(function (err) {
                    console.log(err);
                    current.flashMessage = 'Incompatible File Type'
                    var parent = current;
                    setTimeout(function() { parent.flashMessage=''; }, 5000)
                });
            });
            };
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

  activate(itemId){
   /* this.http.fetch('/searchableItems/'+itemId+'.json')
         .then(response => response.json())
         .then(item => {}
         );*/
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


          //parent.flashMessage = '';
          //var fm = document.getElementById("flashmessage");
          //if (fm) fm.set
          // Add to styled file input count feature
            var fileName = '';
            if( this.files && this.files.length > 1 )
              fileName = ( this.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', this.files.length );
            else
              fileName = e.target.value.split( '\\' ).pop();

            if( fileName ){
              label.querySelector( 'span' ).innerHTML = fileName;
              document.getElementById("button-accept").disabled = false;
            }else
              label.innerHTML = labelVal;

          // Make width of file input and label the same
            input.style.width = label.offsetWidth + "px";
    
        });


    });



  }
  
}