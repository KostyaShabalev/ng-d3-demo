import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { GraphComponent } from './components/graph/graph.component';
import { GraphService } from './services/graph.service';

@NgModule({
  declarations: [
		AppComponent,
		GraphComponent
  ],
  imports: [
		BrowserModule,
		HttpClientModule
  ],
  providers: [
		GraphService
	],
  bootstrap: [AppComponent]
})
export class AppModule { }
