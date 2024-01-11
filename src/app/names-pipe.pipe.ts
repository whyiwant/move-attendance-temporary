import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'namesPipe'
})
export class NamesPipePipe implements PipeTransform {

  transform(names: any[], limit: number): any {
    if (!names || !limit) {
      return [];
    }
    // filter items array, items which match and return true will be
    // kept, false will be filtered out
    return names.slice(0, limit);
  }

}
