import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { TraderComponent } from './trader/trader.component';
import { Routes, RouterModule } from '@angular/router';
import { RFQService } from './rfq.service';
import {SymphonyService} from './symphony.service';
import { PricingComponent } from './pricing/pricing.component';
import { ControllerComponent } from './controller/controller.component';

const appRoutes: Routes = [
  { path: 'client/:id',      component: MainComponent },
  { path: 'trader',      component: TraderComponent },
  { path: 'trader/:id',      component: PricingComponent },
  { path: 'controller',      component: ControllerComponent },
];


@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    TraderComponent,
    PricingComponent,
    ControllerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(
      appRoutes
    )
  ],
  providers: [RFQService, SymphonyService],
  bootstrap: [AppComponent]
})
export class AppModule { }
