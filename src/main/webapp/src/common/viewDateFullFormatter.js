import moment from 'moment';

export class ViewDateFullFormatValueConverter {
  toView(value) {
    return moment(value).format('HH:mm, DD-MMM-YYYY');
  }
}