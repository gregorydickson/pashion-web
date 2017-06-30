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
    var parent = this;
    $(this.element).datepicker({
        dateFormat: "dd-M-yy",
        autoclose: true,
        showButtonPanel: true,
        closeText: 'Clear',
        dayNamesMin: [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ],
        minDate: new Date(),
        onClose: function(dateText, inst) {
            if ($(window.event.srcElement).hasClass('ui-datepicker-close')) {
                document.getElementById(this.id).value = '';
                $(this.element).datepicker('setDate', null);
                parent.ea.publish('datepicker',{elementId: parent.element.id,elementValue:''});
            }
        }

    })

      .on('change', e => fireEvent(e.target, 'input'));
      
    $(this.element).on('change', e =>  this.ea.publish('datepicker', {elementId: this.element.id,
                                                         elementValue:this.element.value}));
    // RM new
    // #clearDates is a button to clear the datepickers
    /*$('#clearDates').on('click', function(){
        dates.attr('value', '');
        dates.each(function(){
            $.datepicker._clearDate(this);
        });
      });​​*/


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