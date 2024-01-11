import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddTitlePageRoutingModule } from './add-title-routing.module';

import { AddTitlePage } from './add-title.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddTitlePageRoutingModule
  ],
  declarations: [AddTitlePage]
})
export class AddTitlePageModule {}
