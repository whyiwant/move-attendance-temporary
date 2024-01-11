import { Component, OnInit } from '@angular/core';
import { Database, getDatabase, push, ref, set } from 'firebase/database';
import { Messaging, getMessaging, getToken } from 'firebase/messaging';

@Component({
  selector: 'app-subscribe-notification',
  templateUrl: './subscribe-notification.page.html',
  styleUrls: ['./subscribe-notification.page.scss'],
})
export class SubscribeNotificationPage implements OnInit {
  db: Database;
  messaging: Messaging;

  constructor() {
    this.db = getDatabase();
    this.messaging = getMessaging();
  }

  ngOnInit() {}

  requestNotificationPermission() {
    console.log('Requesting permission...');
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        console.log('Notification permission granted.');
      }
    });
  }

  getToken() {
    getToken(this.messaging, {
      vapidKey:
        'BGEbDXnkFX0oYBEvC4lamkNC1AC1dQMJll6w7f_avkjp6mpj_-ZGWAad4qd_rmnOPunedlDR9JlDmkIVecLNEiI',
    })
      .then((currentToken) => {
        if (currentToken) {
          console.log(currentToken);
          push(
            ref(this.db, 'new_online_attendance2022/subscribers'),
            currentToken
          );
        } else {
          // Show permission request UI
          console.log(
            'No registration token available. Request permission to generate one.'
          );
          // ...
        }
      })
      .catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
        // ...
      });
  }
}
