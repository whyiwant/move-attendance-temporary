import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SubscribeNotificationPage } from './subscribe-notification.page';

const routes: Routes = [
  {
    path: '',
    component: SubscribeNotificationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubscribeNotificationPageRoutingModule {}
