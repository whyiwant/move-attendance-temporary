import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import {
  Auth,
  ConfirmationResult,
  getAuth,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { Database, getDatabase, onValue, ref, set } from 'firebase/database';
import { Location } from '@angular/common';
import { presentAlert } from 'src/helper';
import { PERMISSION } from 'src/app/constants';

@Component({
  selector: 'app-login-email',
  templateUrl: './login-email.page.html',
  styleUrls: ['./login-email.page.scss'],
})
export class LoginEmailPage implements OnInit {
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
    this.title.setTitle('Login');
  }

  close() {
    this.location.back();
  }

  login() {
    signInWithEmailAndPassword(this.auth, this.email, this.password)
      .then(async (res) => {
        var user = res.user;
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
          message: 'Login successfully.',
          buttons: ['OK'],
        });

        await alert.present();
        alert.onDidDismiss().then((data) => {
          this.router.navigate(['']);
        });
      })
      .catch((error) => {
        console.log(error);

        if (error.code == 'auth/user-not-found') {
          presentAlert('Email not found.', this.alertController);
        } else if (error.code == 'auth/wrong-password') {
          presentAlert('Wrong password.', this.alertController);
        }
      });
  }

  reg() {
    this.router.navigate(['register-email']);
  }

  forgetPs() {
    this.router.navigate(['forget-password']);
  }
}
