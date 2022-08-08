import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ResultsPageRoutingModule } from './results-routing.module';
import { ResultsPage } from './results.page';
import { FooterComponentComponent } from '../../shared/footer-component/footer-component.component';
import { TranslateModule } from '@ngx-translate/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ResultEffects } from './+state/result.effects';
import { resultReducer } from './+state/result.reducer';
import { RESULT_CONFIG_TOKEN, RESULT_LOCAL_STORAGE_KEY, RESULT_STORAGE_KEYS } from './results.tokens';
import { ResultsService } from './results.service';
import { LocalStorageService } from 'src/app/local-storage.service';
import { storageMetaReducer } from 'src/app/storage.metareducer';


export function getResultConfig(saveKeys: string, localStorageKey: string, storageService: LocalStorageService) {
  return {
    metaReducers: [storageMetaReducer(({ offers, filterState }) => ({ offers, filterState }), localStorageKey, storageService)]
  };
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResultsPageRoutingModule,
    TranslateModule,
    StoreModule.forFeature('result', resultReducer, RESULT_CONFIG_TOKEN),
    EffectsModule.forFeature([ ResultEffects ]),
  ],
  declarations: [ResultsPage, FooterComponentComponent],
  providers: [
    ResultsService,
    ResultEffects,
    {
      provide: RESULT_LOCAL_STORAGE_KEY,
      useValue: '__result_storage__'
    },
    { 
      provide: RESULT_STORAGE_KEYS,
      useValue: 'result'
    },
    {
      provide: RESULT_CONFIG_TOKEN,
      deps: [ RESULT_STORAGE_KEYS, RESULT_LOCAL_STORAGE_KEY, LocalStorageService ],
      useFactory: getResultConfig
    }
  ],
})
export class ResultsPageModule {}
