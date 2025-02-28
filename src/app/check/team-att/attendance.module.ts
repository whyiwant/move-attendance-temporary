import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AttendancePageRoutingModule } from './attendance-routing.module';

import { AttendancePage } from './attendance.page';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AttendancePageRoutingModule,
    NgxChartsModule,
    NavBarComponent,
  ],
  declarations: [AttendancePage],
})
export class AttendancePageModule {}
