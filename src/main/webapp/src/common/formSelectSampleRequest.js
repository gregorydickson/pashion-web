import {bindable, inject,bindingMode, customElement} from 'aurelia-framework';

// Import JSPM modules we installed earlier
import $ from 'jquery';
import 'select2';


@customElement('form-select-sr') // Define the name of our custom element
@inject(Element) // Inject the instance of this element
export class FormSelectSampleRequest {
    @bindable name = null;    // name/id of custom select
    @bindable({ defaultBindingMode: bindingMode.twoWay, changeHandler:'selectedChanged'})  selected = '';  // default selected values
    @bindable options = {};   // array of options with id/name properties
    @bindable placeHolder = null;
    @bindable allow_clear = false;
    @bindable width = '110px';
    sel = null
    constructor(element) {
        this.element = element;
    }

    optionsChanged(){
      
      if(this.sel){
        this.sel.trigger('change');
      } else {
        this.setup();
      }
    }

    selectedChanged(){
      console.log("select 2 (formSelect.js) Changed");
      //console.log(JSON.stringify(this.selected));
      if(this.selected && this.sel){
        
        this.sel.val(this.selected).trigger('change');
      }
      //console.log("selected");
    }

    attached(){
      this.setup();
    }
    // Once the Custom Element has its DOM instantiated and ready for binding
    // to happenings within the DOM itself
    setup() {
        var el = $(this.element).find('select');
        this.sel = el.select2({
          width: this.width,
          minimumResultsForSearch: 15 // only allow terms up to n characters long
            });

        // preload selected values
        this.sel.val(this.selected).trigger('change');

        // on any change, propagate it to underlying select to trigger two-way bind
        this.sel.on('change', (event) => {
          // don't propagate endlessly
          // see: http://stackoverflow.com/a/34121891/4354884
          if (event.originalEvent) { return; }
          // dispatch to raw select within the custom element
          // bubble it up to allow change handler on custom element
          var notice = new Event('change', {bubbles: true});
          $(el)[0].dispatchEvent(notice);
        });
        

        console.log("*****************   select2 setup ***********************");
    }

    unbind() {
        $(this.element).find('select')
            .select2("destroy").off('change');
        console.log("select2 unbound");
    }
}
