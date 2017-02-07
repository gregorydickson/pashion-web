import {DialogController} from 'aurelia-dialog';
import {HttpClient,json} from 'aurelia-fetch-client';
import 'fetch';
import {inject} from 'aurelia-framework';
import {DateFormat} from 'common/dateFormat';


@inject(HttpClient, DialogController)
export class AddFilesDialog {
  static inject = [DialogController];

  seasons = [];
  selectedSeason = '';
  selectedFiles;
  formData;
  isPrivate;

  constructor(http, controller){
    this.controller = controller;

    http.configure(config => {
      config
        .useStandardConfiguration();
    });
    this.http = http;
  }

  activate(){
    
  }

  close(){
    this.controller.close();
  }

  attached() {
    this.http.fetch('/dashboard/seasonsByBrand').then(response => response.json()).then(seasons => this.seasons = seasons);
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
  filterAddToSeason (){

  }


  addFiles (){
    this.formData = new FormData();
    console.log("add actions here");
    let j = this.selectedFiles.length;
    var file;
    for (var i = 0; i < j; i++) {

      file = this.selectedFiles[i];

      this.formData.append(this.selectedFiles[i].name,file)
    }
    if(this.isPrivate)
      this.formData.append('isPrivate', this.isPrivate);
    this.formData.append('season', this.selectedSeason);

    this.http.fetch('/searchableItem/upload', {
        method:'POST',
        body:this.formData   
    }).then(response => {
        console.log('Status:', response);
        this.controller.close();
    }).catch(e => {
        console.log('Error saving ',e);
    });
    

  }

  lookEditMenu(){
    var menu = document.getElementById("newCollection");
    menu.classList.toggle("look-menu-hide");
  }

  close (){
    this.controller.close();
  }
  
}