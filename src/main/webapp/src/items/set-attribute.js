import {DataAttributeObserver} from 'aurelia-binding';

export class SetAttributeBindingBehavior {
  bind(binding, source) {
    binding.targetObserver = new DataAttributeObserver(binding.target, binding.targetProperty);
  }

  unbind(binding, source) {}
}