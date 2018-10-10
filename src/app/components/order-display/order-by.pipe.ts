import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {



    transform(records: Array<object>, args?: any): any {
        if (args.property === 'invoiceFinalTotal' || args.property === 'orderNumber') {

            return records.sort(function (a, b) {

                if (a[args.property] === '' || a[args.property] === null || typeof a[args.property] === 'undefined') {
                    return 1;
                }
                if (b[args.property] === '' || b[args.property] === null || typeof b[args.property] === 'undefined') {
                    return -1;
                }
                if ((a[args.property] - b[args.property]) > 0) {
                    return -1 * args.direction;
                } else if ((a[args.property] - b[args.property]) <= 0) {
                    return 1 * args.direction;
                } else {
                    return 0;
                }
            });

        } else {
            return records.sort(function (a, b) {

                console.log(a[args.property])
                if (a[args.property] === '' || a[args.property] === null || typeof a[args.property] === 'undefined') {
                    return 1;
                }
                if (b[args.property] === '' || b[args.property] === null || typeof b[args.property] === 'undefined') {
                    return -1;
                }
                const aUpper = a[args.property].toUpperCase();
                const bUpper = b[args.property].toUpperCase();
                if (aUpper < bUpper) {
                    return -1 * args.direction;
                } else if (aUpper > bUpper) {
                    return 1 * args.direction;
                } else {
                    return 0;
                }
            });
        }

    }


}
