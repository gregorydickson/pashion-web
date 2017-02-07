
export class SeasonAbbreviationValueConverter {
  toView(value, seasons) {

        var i;
        for (i = 0; i < seasons.length; i++) {
            if (seasons[i].name == value) {
                return seasons[i].abbreviation;
            }
        }
        return '';
  }
}