import {DialogController} from 'aurelia-dialog';
import {inject} from 'aurelia-framework';
import {DateFormat} from 'common/dateFormat';
import $ from 'jquery';
import { UserService } from 'services/userService';


@inject(DialogController, UserService)
export class Zoom {
  static inject = [DialogController];
  currentItem = {};
  brand = '';
  season = '';
  rows = [];
  rowNumber = 0;
  itemNumber = 0;
  image = '';
  name = '';

  constructor(controller,userService){
    this.controller = controller;
    this.userService = userService;
  }

  activate(zoomModel){
    this.currentItem = zoomModel.item;
    this.brand = zoomModel.item.brand;
    this.season = zoomModel.item.season;
    this.rows = zoomModel.rows;
    this.rowNumber = zoomModel.rowNumber;
    this.itemNumber = zoomModel.itemNumber;
    this.image = zoomModel.item.image;
    this.name = zoomModel.item.name;
    this.imageProvider = zoomModel.item.imageProvider;
    this.user = this.userService.getUser().then(user => {
                this.user = user;
            })
    console.log("zoom.js row number :"+zoomModel.rowNumber);
    console.log("zoom.js item number :"+zoomModel.itemNumber);
    //console.log("rows  :"+zoomModel.rows);
    console.log("item  :"+zoomModel.item);
    console.log("image:"+zoomModel.item.image);
  }

  close(){
    this.controller.close();
  }

  detached(){
    console.log("detached");
    $(window).off("resize", zoomSize);
  }

  attached() {
    zoomSize();
    $(window).on("resize",zoomSize);
  }


  nextImage(){
    console.log("rowNumber:"+this.rowNumber);
    console.log("rows:"+this.rows.length);
    let numberThisRow = this.rows[this.rowNumber].numberImagesThisRow;
    
    if((this.itemNumber+1) < numberThisRow) {
      this.itemNumber++;
      let arow = this.rows[this.rowNumber];
      let items = arow.items;
      let item = items[this.itemNumber];
      this.image = item.image;
      this.name = item.name;
      this.season = item.season;
      this.brand = item.brand;
      console.log("image:"+this.image);
    } else{
      console.log("else");
      this.itemNumber = 0;
      if(this.rowNumber < this.rows.length-1){
        this.rowNumber = this.rowNumber + 1;
      } else {
        this.rowNumber = 0
      }

      let arow = this.rows[this.rowNumber];
      if(arow){
        
        let items = arow.items;
        let item = items[this.itemNumber];
        this.image = item.image;
        this.name = item.name;
        this.season = item.season;
        this.brand = item.brand;
      }

    }
  }
  previousImage(){
    console.log("rowNumber:"+this.rowNumber);
    console.log("rows:"+this.rows.length);
    let numberThisRow = this.rows[this.rowNumber].numberImagesThisRow;
    console.log("number this row:"+numberThisRow);
    console.log("item number:"+this.itemNumber);
    if(this.itemNumber > 0) {
      this.itemNumber--;
      let arow = this.rows[this.rowNumber];
      let items = arow.items;
      let item = items[this.itemNumber];
      this.image = item.image;
      this.name = item.name;
      this.season = item.season;
      this.brand = item.brand;
      console.log("image:"+this.image);
    } else{
      console.log("else");
      if(this.rowNumber > 0){
        this.rowNumber = this.rowNumber - 1;
      } else {
        this.rowNumber = this.rows.length -1;
      }

      let arow = this.rows[this.rowNumber];
      if(arow){
        
        this.itemNumber = numberThisRow-1;
        let items = arow.items;
        let item = items[this.itemNumber];
        this.image = item.image;
        this.name = item.name;
        this.season = item.season;
        this.brand = item.brand;
      }

    }

  }
  
}

var zoomSize = function() {
    try{
      console.log("resizing");
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
    } catch(e){
      console.error("Error in Zoom resize");
    }    
}