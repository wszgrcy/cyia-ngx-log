import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LogModule } from 'ngx-log';
import { environment } from '../environments/environment.prod'
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    LogModule.forRoot({ printControl: 0b1111 })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
