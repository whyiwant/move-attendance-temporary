import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import {
  Auth,
  ConfirmationResult,
  createUserWithEmailAndPassword,
  getAuth,
} from 'firebase/auth';
import { Database, getDatabase, ref, onValue, set } from 'firebase/database';
import { Location } from '@angular/common';
import { presentAlert } from 'src/helper';
import { PERMISSION } from '../../constants';

@Component({
  selector: 'app-register-email',
  templateUrl: './register-email.page.html',
  styleUrls: ['./register-email.page.scss'],
})
export class RegisterEmailPage implements OnInit {
  auth!: Auth;
  db: Database;
  confirmationResult!: ConfirmationResult;
  email = '';
  password = '';

  constructor(
    private alertController: AlertController,
    private router: Router,
    private title: Title,
    private location: Location
  ) {
    this.auth = getAuth();
    this.auth.useDeviceLanguage();
    this.db = getDatabase();
  }

  ngOnInit() {}

  ionViewWillEnter() {
    this.title.setTitle('Register');
  }

  close() {
    this.location.back();
  }

  reg() {
    createUserWithEmailAndPassword(this.auth, this.email, this.password)
      .then(async (res) => {
        const user = res.user;
        console.log('Successfully registered.');
        console.log(user);
        const userRef = ref(
          this.db,
          'new_online_attendance2022/users/' + user.uid
        );
        onValue(userRef, (ss) => {
          if (!ss.exists()) {
            set(userRef, {
              id: user.uid,
              phoneNum: user.email,
              permission: PERMISSION.NOT_VERIFIED,
            });
          }
        });

        const alert = await this.alertController.create({
          backdropDismiss: false,
          message: 'Register successfully.',
          buttons: ['OK'],
        });

        await alert.present();
        alert.onDidDismiss().then((data) => {
          this.router.navigate(['']);
        });
      })
      .catch((error) => {
        console.log(error);
        if (error.code == 'auth/email-already-in-use') {
          presentAlert(
            'Account existed. (You might registered before at follow up website.)',
            this.alertController
          );
        } else if (error.code == 'auth/weak-password') {
          presentAlert(
            'Password should be at least 6 characters.',
            this.alertController
          );
        }
      });
  }
}
