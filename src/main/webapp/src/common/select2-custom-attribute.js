import {
  customAttribute,
  inject
} from 'aurelia-framework';
import {
  Helpers
} from './helpers';

@customAttribute('select2')
@inject(Element, Helpers)
export class Select2CustomAttribute {
  constructor(element, Helpers) {
    this.element = element;
    this.helpers = Helpers;
  }

  attached() {
    $(this.element).select2(this.value)
      .on('change', (e) => {
        if (e.originalEvent) {
          return;
        }
        this.helpers.dispatchEvent(this.element, 'change', e.target.value);
        //  this.element.dispatchEvent(new Event('change'));
      });
  }

  reset() {
    $(this.element).select2('val', "");
  }

  reload(){
    this.detached();
    this.attached();
  }

  detached() {
    $(this.element).select2('destroy');
  }
}