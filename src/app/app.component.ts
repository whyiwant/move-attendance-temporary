import { Component } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { Auth, getAuth, onAuthStateChanged } from 'firebase/auth';
import { Database, getDatabase, onValue, ref } from 'firebase/database';
import { environment } from 'src/environments/environment';
import { PERMISSION, CHECK_PERMISSION } from './constants';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  app = initializeApp(environment.firebase);

  auth!: Auth;
  db!: Database;
  user: any;

  public appPages = [
    // {
    //   title: 'Submit Attendance',
    //   url: '/home',
    //   icon: 'pencil',
    // },
    // {
    //   title: 'Check Attendance (Weekly)',
    //   url: '/check-weekly-att',
    //   icon: 'book',
    // },
    // { title: 'Check Attendance (Team)', url: '/check-team-att', icon: 'book' },
    // { title: 'Add Title', url: '/add-title', icon: 'add' },
  ];

  constructor() {
    this.auth = getAuth();
    this.db = getDatabase();

    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.user = user;
        const userRef = ref(
          this.db,
          'new_online_attendance2022/users/' + user.uid
        );
        onValue(userRef, (v) => {
          if (v.exists()) {
            this.user = v.val();
            this.managePagesAccess(true);
          } else {
            this.managePagesAccess(false);
          }
        });
      } else {
        console.log('No user.');
        this.managePagesAccess(false);
      }
    });
  }

  managePagesAccess(isUser: boolean) {
    if (isUser) {
      this.appPages = [
        {
          title: 'Submit Attendance',
          url: '/home',
          icon: 'pencil',
          canAccess: true,
        },
        {
          title: 'Check Attendance (Weekly)',
          url: '/check-weekly-att',
          icon: 'book',
          canAccess: CHECK_PERMISSION.canCheckAtt(this.user),
        },
        {
          title: 'Check Attendance (Team)',
          url: '/check-team-att',
          icon: 'book',
          canAccess: CHECK_PERMISSION.canCheckAtt(this.user),
        },
        {
          title: 'Add Title',
          url: '/add-title',
          icon: 'add',
          canAccess:
            this.user.permission &&
            this.user.permission == PERMISSION.SUPER_USER,
        },
        {
          title: 'Manage User',
          url: '/user-management',
          icon: 'people',
          // canAccess: this.user.permission == PERMISSION.SUPER_USER,
          canAccess:
            this.user.permission &&
            this.user.permission == PERMISSION.SUPER_USER,
          category: 'pastoral',
        },
      ];
      console.log(this.appPages);
    } else {
      this.appPages = [
        {
          title: 'Submit Attendance',
          url: '/home',
          icon: 'pencil',
          canAccess: true,
        },
      ];
    }
  }
}
