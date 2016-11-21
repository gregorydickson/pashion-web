import {DialogController} from 'aurelia-dialog';
import {HttpClient,json} from 'aurelia-fetch-client';
import 'fetch';
import {inject} from 'aurelia-framework';
import {DateFormat} from 'common/dateFormat';

@inject(HttpClient, DialogController)
export class CreateDialogUpdatePhoto {
  static inject = [DialogController];

  constructor(http, controller){
    this.controller = controller;

    http.configure(config => {
      config
        .useStandardConfiguration();
    });
    this.http = http;
  }

  activate(itemId){
    this.http.fetch('/searchableItems/'+itemId+'.json')
         .then(response => response.json())
         .then(item => {}
         );
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