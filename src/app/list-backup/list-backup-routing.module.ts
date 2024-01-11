import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListBackupPage } from './list-backup.page';

const routes: Routes = [
  {
    path: '',
    component: ListBackupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListBackupPageRoutingModule {}
