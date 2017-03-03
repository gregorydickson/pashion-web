// Aurelia Framework specific functionality
import { bindable, inject, customElement } from 'aurelia-framework';

// Import JSPM modules we installed earlier
import $ from 'jquery';
import select2 from 'select2';

@customElement('form-select-sample-2') // Define the name of our custom element
@inject(Element) // Inject the instance of this element
export class CustomSelect {
    @bindable name = null; // The name of our custom select
    @bindable selected = null; // The default selected value
    @bindable options = []; // The label/option values
    @bindable Value = null;
    @bindable placeHolder = null;

    constructor(element) {
        this.element = element;
    }

    // Once the Custom Element has its DOM instantiated and ready for binding
    // to happenings within the DOM itself
    attached() {
        var vm = this;
        $(this.element).find('select')
            .select2({minimumResultsForSearch: 15})
            .on('change', (event) => {
                let changeEvent;

                // lets grab the option object from the selection
                let option = event.added.element["0"].model || null;

                if (window.CustomEvent) {
                    changeEvent = new CustomEvent('change', {
                        detail: {
                            value: option
                        },
                        bubbles: true
                    });
                } else {
                    changeEvent = document.createEvent('CustomEvent');
                    changeEvent.initCustomEvent('change', true, true, { value: option });
                }
                this.element.dispatchEvent(changeEvent);
            });
    }

    detached() {
        $(this.element).find('select')
            .select2("destroy").off('change');
    }

}