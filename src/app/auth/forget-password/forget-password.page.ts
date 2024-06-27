import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import {
  Auth,
  ConfirmationResult,
  getAuth,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { Database, getDatabase } from 'firebase/database';
import { Location } from '@angular/common';
import { presentAlert } from 'src/helper';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.page.html',
  styleUrls: ['./forget-password.page.scss'],
})
export class ForgetPasswordPage implements OnInit {
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
    this.title.setTitle('Forget Password');
  }

  close() {
    this.location.back();
  }

  sendMail() {
    sendPasswordResetEmail(this.auth, this.email)
      .then(() => {
        presentAlert('Password reset mail sent.', this.alertController);
      })
      .catch((error) => {
        console.log(error);
        if (error.code == 'auth/invalid-email') {
          presentAlert(
            'Please provide a valid email address!',
            this.alertController
          );
        } else if (error.code == 'auth/user-not-found') {
          presentAlert('Email not found.', this.alertController);
        }
      });
  }
}
