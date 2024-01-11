import { Component } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  app = initializeApp(environment.firebase);

  public appPages = [
    {
      title: 'Submit Attendance',
      url: '/home',
      icon: 'pencil',
    },
    { title: 'Check Attendance', url: '/check-att', icon: 'book' },
    { title: 'Add Title', url: '/add-title', icon: 'add' },
  ];

  constructor() {}
}
