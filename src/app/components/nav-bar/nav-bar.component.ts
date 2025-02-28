import { Component, Input, OnInit } from '@angular/core';
import { Auth, signOut } from 'firebase/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AppUser } from 'src/interface/AppUser';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterModule],
})
export class NavBarComponent implements OnInit {
  @Input()
  user!: AppUser;
  @Input()
  title!: string;
  @Input()
  auth!: Auth;

  constructor() {
    // this.auth = getAuth();
    // this.db = getDatabase();
    // onAuthStateChanged(this.auth, (user) => {
    //   this.firebaseUser = user;
    //   if (user) {
    //     const userRef = ref(this.db, 'move_follow_up_2023/users/' + user.uid);
    //     get(userRef).then((v) => {
    //       if (v.exists()) {
    //         if (v.val()['permission'] == PERMISSION.SUPER_USER) {
    //           this.user = v.val();
    //         } else {
    //           this.helperService.router.navigate(['']);
    //         }
    //       }
    //     });
    //   } else {
    //     this.helperService.router.navigate(['']);
    //   }
    // });
  }

  ngOnInit() {}

  logout() {
    signOut(this.auth)
      .then(() => {
        console.log('Signed out.');
        window.location.reload();
      })
      .catch((err) => {});
  }
}
