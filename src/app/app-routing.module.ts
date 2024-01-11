import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'submit-time',
    loadChildren: () => import('./check/submit-time/submit-time.module').then( m => m.SubmitTimePageModule)
  },
  {
    path: 'check-att',
    loadChildren: () => import('./check/attendance/attendance.module').then( m => m.AttendancePageModule)
  },
  {
    path: 'list-backup',
    loadChildren: () => import('./list-backup/list-backup.module').then( m => m.ListBackupPageModule)
  },
  {
    path: 'add-title',
    loadChildren: () => import('./add-title/add-title.module').then( m => m.AddTitlePageModule)
  },
  {
    path: 'subscribe-notification',
    loadChildren: () => import('./subscribe-notification/subscribe-notification.module').then( m => m.SubscribeNotificationPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
