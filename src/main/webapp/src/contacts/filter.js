export class FilterValueConverter {
    toView(array, searchTerm, filterFunc) {

        if (!typeof(array)) return;
        if (!array) return;
        if (array == null) return;
        if (array == 'undefined') return;
        if (array == undefined) return;


        try {
            return array.filter((item) => {

                let matches = searchTerm && searchTerm.length > 0 ? filterFunc(searchTerm, item) : true;

                return matches;
            });
        } catch (e) {}

    }
}
