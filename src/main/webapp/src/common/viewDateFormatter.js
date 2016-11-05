import moment from 'moment';

export class ViewDateFormatValueConverter {
  toView(value) {
    return moment(value).format('YYYY-M-D');
  }
}