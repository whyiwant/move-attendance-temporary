/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable max-len */
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {
  Database,
  DatabaseReference,
  equalTo,
  getDatabase,
  onValue,
  orderByChild,
  query,
  ref,
} from 'firebase/database';

@Component({
  selector: 'app-submit-time',
  templateUrl: './submit-time.page.html',
  styleUrls: ['./submit-time.page.scss'],
})
export class SubmitTimePage implements OnInit {
  db: Database;
  ref: DatabaseReference;

  arrCG = [];
  arrTitle = [];
  arrAtt = [];
  arrNum = [];

  selectCG: any;
  selectTitle: any;

  constructor(private title: Title) {
    this.db = getDatabase();
    this.ref = ref(this.db, 'new_online_attendance2022');
    // this.ref = db.database.ref('new_online_attendance2022');

    onValue(ref(this.db, 'new_online_attendance2022/CGs'), (snapshot) => {
      this.arrCG = Object.values(snapshot.val());
    });

    onValue(ref(this.db, 'new_online_attendance2022/titles'), (snapshot) => {
      this.arrTitle = Object.values(snapshot.val());
      this.arrTitle.reverse();
    });

    // db.list('new_online_attendance2022/CGs', /*ref => ref.orderByChild('level')*/).valueChanges().subscribe(data => {
    //   this.arrCG = data;
    // });

    // db.list('new_online_attendance2022/titles', /*ref => ref.orderByChild('level')*/).valueChanges().subscribe(d => {
    //   this.arrTitle = d;
    //   this.arrTitle.reverse();
    // });
  }

  ngOnInit() {}

  ionViewWillEnter() {
    this.title.setTitle('Submit Time');
  }

  titleSelected() {
    const q = query(
      ref(this.db, 'new_online_attendance2022/atts'),
      orderByChild('title'),
      equalTo(this.selectTitle)
    );

    onValue(q, (snapshot) => {
      this.arrAtt = Object.values(snapshot.val());
    });
    // this.db.list('new_online_attendance2022/atts', ref => ref.orderByChild('title').equalTo(this.selectTitle)).valueChanges().subscribe(d => {
    //   this.arrAtt = d;
    // });
  }

  get sortedAtt() {
    return this.arrAtt.sort((obj1, obj2) => {
      if (obj1.smallTeam > obj2.smallTeam) {
        return 1;
      } else if (obj1.smallTeam < obj2.smallTeam) {
        return -1;
      } else {
        if (obj1.CGnumber > obj2.CGnumber) {
          return 1;
        } else if (obj1.CGnumber < obj2.CGnumber) {
          return -1;
        } else {
          if (obj1.CG > obj2.CG) {
            return 1;
          } else if (obj1.CG < obj2.CG) {
            return -1;
          }
        }
      }
      return 0;
    });
  }
}
