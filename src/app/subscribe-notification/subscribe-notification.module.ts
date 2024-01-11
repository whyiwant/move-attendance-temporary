import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubscribeNotificationPageRoutingModule } from './subscribe-notification-routing.module';

import { SubscribeNotificationPage } from './subscribe-notification.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SubscribeNotificationPageRoutingModule
  ],
  declarations: [SubscribeNotificationPage]
})
export class SubscribeNotificationPageModule {}
