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
    {
      title: 'Check Attendance (Weekly)',
      url: '/check-weekly-att',
      icon: 'book',
    },
    { title: 'Check Attendance (Team)', url: '/check-team-att', icon: 'book' },
    { title: 'Add Title', url: '/add-title', icon: 'add' },
  ];

  constructor() {}
}
