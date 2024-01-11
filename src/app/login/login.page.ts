import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import {
  Auth,
  ConfirmationResult,
  RecaptchaVerifier,
  getAuth,
  signInWithPhoneNumber,
} from 'firebase/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  auth!: Auth;
  confirmationResult!: ConfirmationResult;
  phoneNumber = '';
  otp = '';
  otpRequested = false;

  constructor(
    private alertController: AlertController,
    private router: Router,
    private title: Title
  ) {
    this.auth = getAuth();
    this.auth.useDeviceLanguage();
  }

  ngOnInit() {}

  ionViewWillEnter() {
    this.title.setTitle('Login');
  }

  requestOTP() {
    if (!this.phoneNumber) {
      this.presentAlert('Invalid format.');
      return;
    }

    if (
      this.phoneNumber != '1121951951' && // Denise
      this.phoneNumber != '162347704' && // En Ying
      this.phoneNumber != '165587190' && // Chong San
      this.phoneNumber != '1151677395' && // Pui Yan
      this.phoneNumber != '169644290' && // Qian Yi
      this.phoneNumber != '189699290' &&
      this.phoneNumber != '121234567'
    ) {
      this.presentAlert('Sorry, you are not permitted to use this function.');
      return;
    }

    let recaptchaVerifier = new RecaptchaVerifier(
      'sign-in-button',
      {
        size: 'invisible',
        callback: (_response: any) => {},
      },
      this.auth
    );

    signInWithPhoneNumber(
      this.auth,
      '+60' + this.phoneNumber,
      recaptchaVerifier
    )
      .then((resp) => {
        this.confirmationResult = resp;
        this.presentAlert(
          "We've sent you a One Time Passcode(OTP) to " +
            '+60' +
            this.phoneNumber +
            '.'
        );
        this.otpRequested = true;
      })
      .catch((error) => {
        if (
          error.message == 'reCAPTCHA has already been rendered in this element'
        ) {
          // this.navCtrl.back()
        }
        this.presentAlert(error);
      });
  }

  login() {
    this.confirmationResult
      .confirm(this.otp)
      .then(async (res) => {
        var user = res.user;
        console.log(user);

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
        if (error.code == 'auth/invalid-verification-code') {
          this.presentAlert('Wrong OTP.');
        }
      });
  }

  async presentAlert(msg: any) {
    const alert = await this.alertController.create({
      message: msg,
      buttons: ['OK'],
    });

    await alert.present();
  }
}
