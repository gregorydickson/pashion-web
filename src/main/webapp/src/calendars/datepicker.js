import {EventAggregator} from 'aurelia-event-aggregator';
import {inject, customAttribute} from 'aurelia-framework';
import $ from 'jquery';
import { datepicker } from 'jquery-ui';





@customAttribute('datepicker')
@inject(Element, EventAggregator)
export class DatePicker {
  constructor(element, eventAggregator) {
    this.element = element;
    this.ea = eventAggregator;
  }
  
  attached() {
    $.datepicker._gotoToday = function(id) {
      var target = $(id);
      var inst = this._getInst(target[0]);
      if (this._get(inst, 'gotoCurrent') && inst.currentDay) {
              inst.selectedDay = inst.currentDay;
              inst.drawMonth = inst.selectedMonth = inst.currentMonth;
              inst.drawYear = inst.selectedYear = inst.currentYear;
      }
      else {
              var date = new Date();
              inst.selectedDay = date.getDate();
              inst.drawMonth = inst.selectedMonth = date.getMonth();
              inst.drawYear = inst.selectedYear = date.getFullYear();
              // the below two lines are new
              this._setDateDatepicker(target, date);
              this._selectDate(id, this._getDateDatepicker(target));
      }
      this._notifyChange(inst);
      this._adjustDate(target);
    }
    $(this.element).datepicker({dateFormat: "yy-mm-dd",
        autoclose: true,
        showButtonPanel: true,
        closeText: 'Close'})
      .on('change', e => fireEvent(e.target, 'input'));
      
    $(this.element).on('change', e =>  this.ea.publish('datepicker', {elementId: this.element.id,
                                                         elementValue:this.element.value}));
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