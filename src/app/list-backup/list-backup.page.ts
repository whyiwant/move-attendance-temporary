import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Database, getDatabase, onValue, ref } from 'firebase/database';

@Component({
  selector: 'app-list-backup',
  templateUrl: './list-backup.page.html',
  styleUrls: ['./list-backup.page.scss'],
})
export class ListBackupPage implements OnInit {
  db: Database;

  arrAtt = [];

  constructor(private title: Title) {
    this.db = getDatabase();
    const backupRef = ref(this.db, 'new_online_attendance2022/backup');
    onValue(backupRef, (snapshot) => {
      this.arrAtt = Object.values(snapshot.val());
    });
    // db.list('new_online_attendance2022/backup', /*ref => ref.orderByChild('level')*/).valueChanges().subscribe(data => {
    //   this.arrAtt = data;
    // });
  }

  ngOnInit() {}

  ionViewWillEnter() {
    this.title.setTitle('List Backup');
  }
}
