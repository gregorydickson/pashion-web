import {bindable, inject, customElement, TaskQueue} from 'aurelia-framework';
import $ from 'jquery';
import 'select2'; 

/*
 Based off of: https://gist.github.com/mujimu/c2da3ecb61f832bac9e0
*/
@customElement('select-control')
@inject(Element, TaskQueue)
export class SelectControl { 
    selectDefaultOptions = { 
        minimumResultsForSearch: 15,
        sorter: function(data) {          
            // Let's remove the placeholder from the list of options
            let index = data.findIndex(x => x.id == "");     
            data.splice(index, 1);

            return data.sort(function(a, b) {               
                return a.text.toUpperCase() < b.text.toUpperCase() ? -1 : a.text.toUpperCase() > b.text.toUpperCase() ? 1 : 0;
            });
        }
    };
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
        this.taskQueue = taskQueue;
    }

    bind(bindingContext) {
        this.bindingContext = bindingContext;
    }

    selectedChanged(value) {    
        console.log('SelectControl.selectedChanged(): Selected values changed');

        let el = $(this.element).find('select');

        if (el) {
            let sel = el.select2(this.selectDefaultOptions);

            if (el && value) {
                try {
                    sel.val(this.selected).trigger('change');
                }
                catch(err) {
                    // A "find of null" error is raised by select2 in some
                    // instances. Doesn't appear to interfere with any
                    // functionality so let's just swallow it until
                    // the root cause can be identified (may need to upgrade)
                    // to version 4.0+
                }
            }
        }
    }

    attached() {
        this.taskQueue.queueMicroTask(() => {
            this.create();
        });
    }

    create() {
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
                let notice = new Event('change', { bubbles: false });
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

            // Reset value to avoid multiple-select problems
            //let value = this.bindingContext[this.element.getAttribute('value.bind')];
            //this.bindingContext[this.element.getAttribute('value.bind')] = [];
            //this.bindingContext[this.element.getAttribute('value.bind')] = value;
        });
       
        console.log('SelectControl.attached(): Component attached');
    }

    detached() {
        $(this.element).find('select').select2('destroy');
        console.log('SelectControl.detached(): Component dettached');
    }
}