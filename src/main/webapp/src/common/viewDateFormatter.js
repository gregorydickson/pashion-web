import moment from 'moment';

export class ViewDateFormatValueConverter {
  toView(value) {
    return moment(value).format('DD-MMM-YYYY');
  }
}