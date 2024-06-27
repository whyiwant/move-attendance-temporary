import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'submit-time',
    loadChildren: () =>
      import('./check/submit-time/submit-time.module').then(
        (m) => m.SubmitTimePageModule
      ),
  },
  {
    path: 'check-weekly-att',
    loadChildren: () =>
      import('./check/weekly-att/attendance.module').then(
        (m) => m.AttendancePageModule
      ),
  },
  {
    path: 'check-team-att',
    loadChildren: () =>
      import('./check/team-att/attendance.module').then(
        (m) => m.AttendancePageModule
      ),
  },
  {
    path: 'list-backup',
    loadChildren: () =>
      import('./list-backup/list-backup.module').then(
        (m) => m.ListBackupPageModule
      ),
  },
  {
    path: 'add-title',
    loadChildren: () =>
      import('./add-title/add-title.module').then((m) => m.AddTitlePageModule),
  },
  {
    path: 'subscribe-notification',
    loadChildren: () =>
      import('./subscribe-notification/subscribe-notification.module').then(
        (m) => m.SubscribeNotificationPageModule
      ),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./auth/login-email/login-email.module').then(
        (m) => m.LoginEmailPageModule
      ),
  },
  {
    path: 'register-email',
    loadChildren: () =>
      import('./auth/register-email/register-email.module').then(
        (m) => m.RegisterEmailPageModule
      ),
  },
  {
    path: 'forget-password',
    loadChildren: () =>
      import('./auth/forget-password/forget-password.module').then(
        (m) => m.ForgetPasswordPageModule
      ),
  },
  {
    path: 'user-management',
    loadChildren: () =>
      import('./auth/user-management/user-management.module').then(
        (m) => m.UserManagementPageModule
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
