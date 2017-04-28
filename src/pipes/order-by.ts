import { Injectable, Pipe } from '@angular/core';

/*
  Generated class for the OrderBy pipe.

  See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
  Angular 2 Pipes.
*/
@Pipe({
  name: 'orderBy'
})
@Injectable()
export class OrderBy {
  /*
    Takes a value and makes it lowercase.
   */
  transform(value, field, asc) {
    return value.sort(function(a, b) {
      if(a[field] < b[field])
        return asc ? -1 : 1;
      if(a[field] > b[field])
        return asc ? 1 : -1;
      return 0;
    });
  }
}
