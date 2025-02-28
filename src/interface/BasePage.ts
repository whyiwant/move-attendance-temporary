import { Database, getDatabase, onValue, ref } from 'firebase/database';
import { Auth, getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { AppUser } from './AppUser';
import { PERMISSION } from 'src/app/constants';
import { Router } from '@angular/router';

export class BasePage {
  db!: Database;

  // auth
  auth!: Auth;
  firebaseUser!: User | null;
  user!: AppUser;

  protected isSecure: boolean;
  protected router: Router;

  page!: string;

  nameFilter: string = '';

  t1!: Date;
  t2!: Date;

  constructor(router: Router, isSecure: boolean) {
    this.isSecure = isSecure;
    this.router = router;

    this.auth = getAuth();
    this.db = getDatabase();

    onAuthStateChanged(this.auth, (user) => {
      this.loadUser(user);
    });
  }

  loadData(): void {}

  loadUser(user: User | null) {
    // console.log(user);

    this.firebaseUser = user;
    if (user) {
      const userRef = ref(
        this.db,
        'new_online_attendance2022/users/' + user.uid
      );
      onValue(userRef, (v) => {
        if (v.exists()) {
          this.user = v.val();

          // console.log(this.user);

          if (
            this.user.permission == PERMISSION.NOT_VERIFIED &&
            this.isSecure
          ) {
            // not verified user
            // redirect to home page
            this.router.navigate(['']);
          }

          this.loadData();
        } else if (this.isSecure) {
          // user logged in but no data
          // redirect to home page (how he came to here?)
          this.router.navigate(['']);
        }
      });
    } else if (this.isSecure) {
      // user not logged in
      // redirect to home page
      this.router.navigate(['']);
    }
  }

  timerStart() {
    this.t1 = new Date();
  }

  timerEnd() {
    this.t2 = new Date();
    console.log(this.t2.getTime() - this.t1.getTime());
  }
}
