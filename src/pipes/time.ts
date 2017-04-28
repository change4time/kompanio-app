import { Injectable, Pipe } from '@angular/core';

import moment from 'moment';
/*
  Generated class for the Time pipe.

  See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
  Angular 2 Pipes.
*/
@Pipe({
  name: 'time'
})
@Injectable()
export class Time {
  /*
    Takes a value and makes it lowercase.
   */
  transform(value: number, arg) {
    let newValue = 0;
    if(!isNaN(value)) {
      if(arg) {
        if(isNaN(arg)) {
          if(arg.since) {
            newValue = value * moment.duration(moment().diff(arg.since)).asHours();
          } else {
            newValue = value * moment.duration(1, arg).asHours();
          }
        } else {
          newValue = value * arg;
        }
      } else {
        newValue = moment.duration(value).asHours();
      }
    }
    return (newValue >= 0 ? '+' : '') + Math.floor(newValue) + ' KT';
  }
}
