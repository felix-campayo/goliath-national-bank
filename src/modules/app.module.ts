import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from '../modules/app-routing.module';
import {
  DataListModule, DialogModule,
  SplitButtonModule, DataTableModule,
  SharedModule, ButtonModule, DropdownModule
} from 'primeng/primeng';

import { ProductPipe } from '../pipes/product.pipe';
import { COMPONENTS } from '../components';
import { PAGES } from '../pages';
import { SERVICES } from '../services';
import { PIPES } from '../pipes';

@NgModule({
  declarations: [
    PAGES,
    COMPONENTS,
    PIPES
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    DataListModule,
    DialogModule,
    ButtonModule,
    SplitButtonModule,
    DataTableModule,
    SharedModule,
    DropdownModule
  ],
  providers: [
    SERVICES,
    PIPES
  ],
  bootstrap: [PAGES[0]]
})
export class AppModule { }
