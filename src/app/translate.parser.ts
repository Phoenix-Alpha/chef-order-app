import { TranslateDefaultParser, TranslateParser} from '@ngx-translate/core';
import { Injectable } from '@angular/core';

@Injectable()
export class CustomParser extends TranslateDefaultParser implements TranslateParser {
    entranslations: any;
    constructor() {
      super();
      this.getEntranslations();
    }

    interpolate(expr: string | Function, params?: any): string {
      return super.interpolate(expr, params);
    }

    getValue(target: any, key: string) {
      const value = super.getValue(target, key);
      return ((value !== key && typeof value !== 'object') &&  value) || (this.entranslations && super.getValue(this.entranslations, key));
    }

    getEntranslations() {
      import(`../assets/translations/i18n/translation.en.json`).then(
        entranslationObj => {this.entranslations = entranslationObj; }
      );
    }
  }
