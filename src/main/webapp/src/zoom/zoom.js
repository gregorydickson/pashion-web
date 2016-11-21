import {DialogController} from 'aurelia-dialog';
import {HttpClient,json} from 'aurelia-fetch-client';
import 'fetch';
import {inject} from 'aurelia-framework';
import {DateFormat} from 'common/dateFormat';


@inject(HttpClient, DialogController)
export class Zoom {
  static inject = [DialogController];
  currentItem = {};

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
         .then(item => {
             this.currentItem = item;
           }
         );
  }

  close(){
    this.controller.close();
  }

  attached() {
 

    // Fit image to screen height

    function zoomSize() {
        var windowHeight = window.innerHeight;
        var windowWidth = window.innerWidth;                
        var imageHeight = document.getElementById('imageZoom').clientHeight;
        var imageWidth = document.getElementById('imageZoom').clientWidth;
        
        document.getElementById('imageZoom').style.maxHeight= 'none';     

        if ( imageHeight < windowHeight*0.7 ) {
          document.getElementById('imageZoom').style.maxHeight= windowHeight*0.75 +'px';     
          document.getElementById('imageZoom').style.height= 'auto';  
        } 
        else {
          document.getElementById('imageZoom').style.height= windowHeight*0.75 +'px';     
         
        }   

        if ( imageWidth > windowWidth*0.7) {
          document.getElementById('imageZoom').style.maxHeight= windowHeight*0.75 +'px';     
          document.getElementById('imageZoom').style.height= 'auto';  
        }       
    }

    zoomSize();

    window.addEventListener("resize", function(){
      zoomSize ();
    }, true);

    // Close dialog when click outside
    var controller = this.controller;

    document.getElementsByTagName('ai-dialog-container')[0].onclick = function(e) {

     if(e.target.id != 'imageZoom' & e.target.id != 'prev' & e.target.id != 'next') {
      controller.close();
     }
    }



  }
  
}