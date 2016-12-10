import moment from 'moment';

export class ViewDateFullFormatValueConverter {
  toView(value) {
    return moment(value).format('HH:mm:ss, DD-MMM-YYYY');
  }
}