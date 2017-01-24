export class TruncateValueConverter {
    toView(value, prop, length = 10) {
        return value[prop].length > length ? value[prop].substring(0, length) + '...' : value;
    }
}