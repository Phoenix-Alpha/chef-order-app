import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { MetaReducer, StoreModule, USER_PROVIDED_META_REDUCERS } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AppComponent } from './app.component';
import { EffectsModule } from '@ngrx/effects';
import { SharedModule } from './shared/shared.module';
import { TranslateModule, TranslateLoader, TranslateParser, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CustomParser } from './translate.parser';
import { environment } from '../environments/environment';
import { CodeInputModule } from 'angular-code-input';
import { NgOtpInputModule } from 'ng-otp-input';
import { CognitoAuthService } from './auth/cognito-auth.service';
import { CognitoUtil } from './auth/cognito.service';
// import { StatusBar } from '@ionic-native/status-bar/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { AuthActionType } from './auth/+state/auth.actions';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { AndroidNotch } from '@ionic-native/android-notch/ngx';
import { TokenInterceptor } from './api/token.interceptor';
import { ApiInterceptor } from './api/api.interceptor';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { BarRatingModule } from 'ngx-bar-rating';
import { NgxMaterialTimepickerModule } from './shared/material-timepicker/ngx-material-timepicker.module';
import { Device } from '@ionic-native/device/ngx';
import { PublicModule } from './public/public.module';
// import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Camera } from '@ionic-native/camera/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

import { StripeService } from './stripe.service';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;

export function clearState(reducer) {
  return (state, action) => {
    if (action.type === AuthActionType.LogoutSuccess) {
    }
    console.log("reducer", state, action);
    return reducer(state, action);
  };
}

export function getMetaReducers(): MetaReducer<any>[] {
  return [clearState];
}
@NgModule({
  declarations: [
    AppComponent,
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    PublicModule,
    IonicModule.forRoot(),
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    CodeInputModule.forRoot({
      codeLength: 6,
      isCharsCode: true,
    }),
    NgxMaskModule.forRoot(),
    BarRatingModule,
    NgOtpInputModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      parser: { provide: TranslateParser, useClass: CustomParser },
    }),
    AppRoutingModule,
    !environment.production ? StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }) : [],
    NgxMaterialTimepickerModule,
  ],
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy
    },
    {
      provide: USER_PROVIDED_META_REDUCERS,
      useFactory: getMetaReducers
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: ApiInterceptor,
    //   multi: true
    // },
    CognitoAuthService,
    CognitoUtil,
    StripeService,
    // StatusBar,
    Camera,
    Geolocation,
    NativeGeocoder,
    LocationAccuracy,
    Diagnostic,
    Deeplinks,
    HTTP,
    Device,
    AndroidNotch,
    BarcodeScanner,
  ],
  bootstrap: [AppComponent],
  exports: [
  ]
})
export class AppModule {
  constructor(private translateService: TranslateService) {
    this.translateService.addLangs(['en', 'fr', 'de', 'nl', 'ar']);
    this.translateService.setDefaultLang('fr');
    this.translateService.use('fr');
  }
}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/translations/i18n/translation.', '.json');
}
