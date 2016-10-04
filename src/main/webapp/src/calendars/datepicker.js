import {EventAggregator} from 'aurelia-event-aggregator';
import {inject, customAttribute} from 'aurelia-framework';
import 'jquery';
import { datepicker } from 'jquery-ui';





@customAttribute('datepicker')
@inject(Element, EventAggregator)
export class DatePicker {
  constructor(element, eventAggregator) {
    this.element = element;
    this.ea = eventAggregator;
  }
  
  attached() {
    $(this.element).datepicker({dateFormat: "yy-mm-dd",
        autoclose: true,
        showButtonPanel: true,
        closeText: 'Close'})
      .on('change', e => fireEvent(e.target, 'input'))
      .on('change', e =>  this.ea.publish('datepicker', {elementId: this.element.id,
                                                         elementValue:this.element.value}));
    if(this.element.id === 'datepickerfrom'){
      $(this.element).datepicker('setDate', new Date());
      this.ea.publish('datepicker', {elementId: this.element.id,elementValue:this.element.value});
    }
  }
  
  detached() {
    $(this.element).datepicker('destroy')
      .off('change');
  }
}

function createEvent(name) {
  var event = document.createEvent('Event');
  event.initEvent(name, true, true);
  return event;
}

function fireEvent(element, name, ) {
  var event = createEvent(name);

  element.dispatchEvent(event);
}