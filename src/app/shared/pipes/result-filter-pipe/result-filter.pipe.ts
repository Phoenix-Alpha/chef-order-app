import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'resultFilter'
})
export class ResultFilterPipe implements PipeTransform {

  transform(value: any[], type: number): any[] {
    if (type === 0) { return value;}
    return value.filter((e) => {
      return e.place.type === type;
    });
  }
}
