import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { IonicSelectableModule } from 'ionic-selectable';
import { NamesPipePipe } from '../names-pipe.pipe';
import { ConfirmAttComponent } from '../popover/confirm-att/confirm-att.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    IonicSelectableModule,
    HttpClientModule,
  ],
  declarations: [HomePage, NamesPipePipe, ConfirmAttComponent],
})
export class HomePageModule {}
