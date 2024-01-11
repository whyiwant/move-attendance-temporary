import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddTitlePage } from './add-title.page';

const routes: Routes = [
  {
    path: '',
    component: AddTitlePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddTitlePageRoutingModule {}
