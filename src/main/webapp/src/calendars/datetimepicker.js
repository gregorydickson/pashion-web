import {inject, customAttribute} from 'aurelia-framework';
import $ from 'jquery';
import { datetimepicker } from 'jquery-datetimepicker';





@customAttribute('timething')
@inject(Element)
export class DateTimePicker {
  
  constructor(element) {
    this.element = element;

  }
  
  
  attached() {
    console.log("attached timething");
    $(this.element).datetimepicker()
      .on('change', e => fireEvent(e.target, 'input'));
        

  }
  
  detached() {
    $(this.element).datetimepicker('destroy')
      .off('change');
  }
}

function fireEvent(element, name) {
  var event = document.createEvent('Event');
  event.initEvent(name, true, true);
  element.dispatchEvent(event);
}

