import {bindable, inject, customElement} from 'aurelia-framework';
import $ from 'jquery';
import 'select2';

/*
 Based off of: https://gist.github.com/mujimu/c2da3ecb61f832bac9e0
*/
@customElement('select2')
//@inject(Element, TaskQueue)
@inject(Element)
export class Select2CustomMultiselect {
    selectDefaultOptions = { };
    //selectDefaultOptions = { tags: true } // Requires SELECT2 v4.0+;
    @bindable name = null;    // name/id of custom select
    @bindable selected = [];  // default selected values
    @bindable options = {};   // array of options with id/name properties
    @bindable placeholder = "";
    @bindable allow_clear = false;
    @bindable selectOptions;
    @bindable grouping = false;

    constructor(element, taskQueue) {
        this.element = element;
        //this.taskQueue = taskQueue;
    }

    selectedChanged(value) {    
        console.log('Select2CustomMultiselect.selectedChanged(): Selected values changed');

        let el = $(this.element).find('select');
        let sel = el.select2({minimumResultsForSearch: 15});
        
        sel.val(this.selected).trigger('change');
    }

    attached() {
        let el = $(this.element).find('select');
        let sel = el.select2(this.selectDefaultOptions);

        sel.val(this.selected).trigger('change');

        sel.on('change', (event) => {
            let changeEvent;

            if (window.CustomEvent) {
                // don't propagate endlessly
                // see: http://stackoverflow.com/a/34121891/4354884          
                if (event.originalEvent) { return; }

                changeEvent = new CustomEvent('change', {
                    detail: {
                        value: event.target.value
                    },
                    bubbles: true
                });

                // dispatch to raw select within the custom element
                let notice = new Event('change', { bubble: false });
                $(el)[0].dispatchEvent(notice);
            }
            else {
                changeEvent = document.createEvent('CustomEvent');
                changeEvent.initCustomEvent('change', true, true, {
                    detail: {
                        value: event.target.value
                    }
                });
            }

            this.element.dispatchEvent(changeEvent);
        });
       
        console.log('Select2CustomMultiselect.attached(): Component attached');
    }

    detached() {
        $(this.element).find('select').select2('destroy');
        console.log('Select2CustomMultiselect.detached(): Component dettached');
    }
}