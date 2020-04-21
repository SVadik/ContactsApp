import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'yesNo'})
export class YesNoPipe implements PipeTransform {
    transform(value) {
        return value ? 'Yes' : 'No';
    }
}