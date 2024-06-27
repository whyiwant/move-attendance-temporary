import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserManagementPageRoutingModule } from './user-management-routing.module';

import { UserManagementPage } from './user-management.page';
import { EditPastoralTeamComponent } from './edit-pastoral-team/edit-pastoral-team.component';
import { EditNameComponent } from './edit-name/edit-name.component';
import { EditAssignedCGComponent } from './edit-assigned-cg/edit-assigned-cg.component';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserManagementPageRoutingModule,
    IonicSelectableModule,
  ],
  declarations: [
    UserManagementPage,
    EditPastoralTeamComponent,
    EditNameComponent,
    EditAssignedCGComponent,
  ],
})
export class UserManagementPageModule {}
