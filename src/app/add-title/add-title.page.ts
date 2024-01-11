import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Auth, getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import {
  Database,
  DatabaseReference,
  child,
  get,
  getDatabase,
  onValue,
  ref,
  set,
} from 'firebase/database';

@Component({
  selector: 'app-add-title',
  templateUrl: './add-title.page.html',
  styleUrls: ['./add-title.page.scss'],
})
export class AddTitlePage implements OnInit {
  db: Database;
  title: string;
  cgTitle: string = 'Friday CG';
  serviceTitle: string = 'YW Service';
  ref: DatabaseReference;
  arrTitle: any[];

  auth!: Auth;
  name: string | null = '';

  constructor(
    private alertController: AlertController,
    private router: Router
  ) {
    this.auth = getAuth();
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        const uid = user.uid;
        console.log(user.displayName);
        console.log(user.phoneNumber);
        if (user.displayName) {
          this.name = user.displayName;
        } else {
          this.name = user.phoneNumber;
        }
      } else {
        console.log('No user.');
        router.navigate(['']);
      }
    });

    this.db = getDatabase();
    this.ref = ref(this.db, 'new_online_attendance2022');
    onValue(child(this.ref, 'titles'), (ss) => {
      this.arrTitle = Object.values(ss.val()).reverse();
    });
  }

  ngOnInit() {}

  addTitle() {
    // this.ref.child('titles').child(this.title).set(this.title)
    set(ref(this.db, 'new_online_attendance2022/titles/' + this.title), {
      title: this.title,
      cgTitle: this.cgTitle,
      serviceTitle: this.serviceTitle,
    });
  }

  async editTitle(title) {
    const alertButtons = [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {},
      },
      {
        text: 'OK',
        role: 'confirm',
        handler: (alertData) => {
          set(ref(this.db, 'new_online_attendance2022/titles/' + title.title), {
            title: title.title,
            cgTitle: alertData.cgTitle,
            serviceTitle: alertData.serviceTitle,
          });
        },
      },
    ];

    const alertInputs = [
      // {
      //   name: 'title',
      //   value: title.title,
      // },
      {
        name: 'cgTitle',
        value: title.cgTitle,
      },
      {
        name: 'serviceTitle',
        value: title.serviceTitle,
      },
    ];

    const alert = await this.alertController.create({
      message: title.title,
      header: 'Edit Title',
      buttons: alertButtons,
      inputs: alertInputs,
    });

    await alert.present();
  }

  convertTitles() {
    get(ref(this.db, 'new_online_attendance2022/titles')).then((ss) => {
      this.arrTitle = Object.values(ss.val());
      console.log(this.arrTitle);
      for (let title of this.arrTitle) {
        set(ref(this.db, 'new_online_attendance2022/titles/' + title), {
          title: title,
          cgTitle: 'Friday CG',
          serviceTitle: 'Service',
        });
      }
    });
  }

  logout() {
    signOut(this.auth)
      .then(() => {
        console.log('Signed out.');
        window.location.reload();
      })
      .catch((err) => {});
  }
}
