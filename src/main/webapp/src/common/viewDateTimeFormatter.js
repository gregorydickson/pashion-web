import moment from 'moment';

export class ViewDateTimeFormatValueConverter {
  toView(value) {
    return moment(value).format('HH:mm:ss');
  }
}