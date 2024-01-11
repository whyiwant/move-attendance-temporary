import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SubmitTimePage } from './submit-time.page';

const routes: Routes = [
  {
    path: '',
    component: SubmitTimePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubmitTimePageRoutingModule {}
