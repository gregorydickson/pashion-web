import {customAttribute, inject} from 'aurelia-framework';

@customAttribute('select2')
@inject(Element)
export class Select2CustomAttribute {
  constructor(element) {
    this.element = element;
  }

  attached() {
    $(this.element).select2(this.value)
      .on('change', (e) => {
        if (e.originalEvent) {
          return;
        }
         this.element.dispatchEvent(new Event('change'));
      });
  }

  detached() {
    $(this.element).select2('destroy');
  }
}