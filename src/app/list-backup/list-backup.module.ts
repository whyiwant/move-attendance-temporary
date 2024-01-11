import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListBackupPageRoutingModule } from './list-backup-routing.module';

import { ListBackupPage } from './list-backup.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListBackupPageRoutingModule
  ],
  declarations: [ListBackupPage]
})
export class ListBackupPageModule {}
