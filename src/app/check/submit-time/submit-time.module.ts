import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubmitTimePageRoutingModule } from './submit-time-routing.module';

import { SubmitTimePage } from './submit-time.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SubmitTimePageRoutingModule
  ],
  declarations: [SubmitTimePage]
})
export class SubmitTimePageModule {}
