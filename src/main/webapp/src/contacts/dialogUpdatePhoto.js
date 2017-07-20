import {
  DialogController
} from 'aurelia-dialog';
import 'fetch';
import {
  inject,
  bindable
} from 'aurelia-framework';
import {
  DateFormat
} from 'common/dateFormat';
import {
  UserService
} from 'services/userService';


@inject(DialogController, UserService)
export class CreateDialogUpdatePhoto {

  flashMessage = '';
  @bindable avatar = null;
  reader = null;
  @bindable avatar = null;

  constructor(controller, userService) {
    this.controller = controller;
    this.userService = userService;
  }


  uploadAvatar() {

    let flashMessage = this.flashMessage;
    let avatar = this.avatar;
    let reader = this.reader;

    if (avatar && reader) {
      console.log("this has an avatar:" + avatar);
      if (avatar[0].type.indexOf('image/') != -1) {
        console.log("the file type of avatar is image");

        reader.readAsDataURL(avatar[0]);
        this.avatar = null;
        console.log('waiting');
        this.close();
      } else {
        this.flashMessage = 'Image Files Only'
        var parent = this;
        setTimeout(function () {
          parent.flashMessage = '';
        }, 5000)
      }

    } else {
      console.log('Selected image successfully');
    }
  }


  close() {
    this.controller.close();
  }

  delete() {
    // clear user.avatar
    // save null to user record
    this.userService.getUser().then(user =>{
      this.user = user;
      this.user.avatar = '';
      this.userService.clearAvatar(this.user);
      this.close();
    });
    
    
  }

  clearMessage() {
    this.flashMessage = '';
    console.log("flashMessage cleared");
  }

  attached() {
    console.log("dialog update photo attached");
    this.reader = new FileReader();
    let flashMessage = this.flashMessage;
    let userService = this.userService;
    let controller = this.controller;
    let reader = this.reader;
    let avatar = this.avatar;
    this.reader.onload = function () {

      var data = reader.result;

      userService.uploadAvatar(data)
        .then(data => {
          console.log('URL ' + data.url);
          avatar = '';

        }).catch(function (err) {
          console.log(err);
          flashMessage = 'Incompatible File Type'

          setTimeout(function () {
            flashMessage = '';
          }, 5000)
        });
    }

    this.reader.onerror = function (error) {
      console.log('Error: ', error);
    };



    var inputs = document.querySelectorAll('.input-file');
    Array.prototype.forEach.call(inputs, function (input) {
      var label = input.nextElementSibling,
        labelVal = label.innerHTML;

      // Fit width of file input and label
      input.style.width = label.offsetWidth + "px";

      //var parent = this;
      input.addEventListener('change', function (e) {


        var fileName = '';
        if (this.files && this.files.length > 1)
          fileName = (this.getAttribute('data-multiple-caption') || '').replace('{count}', this.files.length);
        else
          fileName = e.target.value.split('\\').pop();

        if (fileName) {
          console.log("disable bind with filename");
          label.querySelector('span').innerHTML = fileName;

        } else
          label.innerHTML = labelVal;

        // Make width of file input and label the same
        input.style.width = label.offsetWidth + "px";
      });
    });

  }

}