import {bootstrapApplication} from '@angular/platform-browser';
import {appConfig} from './app/app.config';
import {AppComponent} from './app/app.component';
import { importProvidersFrom, LOCALE_ID } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

// Register the Portuguese locale data
registerLocaleData(localePt, 'pt');

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []), // Include existing providers if any
    importProvidersFrom(BrowserAnimationsModule),
    { provide: LOCALE_ID, useValue: 'pt' },// Add BrowserAnimationsModule here
  ],
}).catch((err) => console.error(err));
