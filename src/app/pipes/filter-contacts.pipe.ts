import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterContacts',
  pure:false
  /*
  pipe pure ou impure - Par défaut un pipe Angular est "pure"

  -> Cela signifie que la détection de changement d'un pipe ne s'exécutera que si la valeur modifiée est une valeur primitive (string, number ou boolean)
  -> Cela signifie aussi que la détection de changement d'un pipe ne s'exécutera pas si la valeur modifiée est un array ou un object
     (pour des raisons de performance essentiellement).

  -> Donc si on veut détecter le changement dans un array ou un object, afin que le pipe s'éxecute à chaque ajout/suppression/modification :
     il faut déclarer le pipe comme impure avec "pure:false"
  */
})
export class FilterContactsPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    if(!value) return [];
    return value.filter( item=>item.name.first.toLowerCase().includes(args) || item.name.last.toLowerCase().includes(args.toLowerCase()) );
  }

}
