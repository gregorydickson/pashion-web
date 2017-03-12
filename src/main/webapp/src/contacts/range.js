export class rangeValueConverter {
    toView(array, searchStartDate,searchEndDate, filterRangeFunc) {

        if (!typeof(array)) return;
        if (!array) return;
        if (array == null) return;
        if (array == 'undefined') return;
        if (array == undefined) return;


        try {
            return array.filter((item) => {

                 // let matches = searchTerm && searchTerm.length > 0 ? filterFunc(searchTerm, item, filterTerm) : true;

                return filterRangeFunc(item.bookingStartDate, searchStartDate,item.bookingEndDate , searchEndDate);



            });
        } catch (e) {console.log ("Exception thrown in range filter: " + e);}

    }
}