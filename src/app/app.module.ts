import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {CalendarModule} from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import {ButtonModule} from 'primeng/button';


import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FiltersComponent } from './components/filters/filters.component';
import { ExecutiveSummaryComponent } from './components/executive-summary/executive-summary.component';
import { PreprocessComponent } from './components/preprocess/preprocess.component';
import { PostinitComponent } from './components/postinit/postinit.component';

@NgModule({
  declarations: [
    AppComponent,
    FiltersComponent,
    ExecutiveSummaryComponent,
    PreprocessComponent,
    PostinitComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CalendarModule,
    FormsModule,
    ButtonModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
