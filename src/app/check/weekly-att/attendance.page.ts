import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Auth, getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import {
  Database,
  equalTo,
  getDatabase,
  onValue,
  orderByChild,
  query,
  ref,
} from 'firebase/database';

class IAtt {
  // total: number = 0
  cntOM: number = 0;
  cntNB: number = 0;
  cntAC: number = 0;
  cntNF: number = 0;
  cntRNF: number = 0;

  get total() {
    return this.cntOM + this.cntNB + this.cntAC + this.cntNF + this.cntRNF;
  }

  reset() {
    this.cntOM = 0;
    this.cntNB = 0;
    this.cntAC = 0;
    this.cntNF = 0;
    this.cntRNF = 0;
  }
}

class Att {
  sky: IAtt = new IAtt();
  ground: IAtt = new IAtt();
  cntAbs: number = 0;

  reset() {
    this.sky.reset();
    this.ground.reset();
    this.cntAbs = 0;
  }
}

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.page.html',
  styleUrls: ['./attendance.page.scss'],
})
export class AttendancePage implements OnInit {
  db: Database;
  ref: any;

  arrCG = [];
  arrTitle = [];
  arrAtt = [];
  arrNum = [];

  selectTitle: any;

  attCG: Att = new Att();
  attService: Att = new Att();

  auth!: Auth;
  name: string | null = '';

  constructor(
    private title: Title,
    private location: Location,
    private route: ActivatedRoute,
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

    onValue(ref(this.db, 'new_online_attendance2022/titles'), (ss) => {
      this.arrTitle = Object.values(ss.val());
      this.arrTitle.reverse();

      this.route.queryParams.subscribe((params) => {
        if (params.title) {
          for (let title of this.arrTitle) {
            if (title.title == params.title) {
              this.selectTitle = title;
              this.titleSelected(); // simulate title selected
            }
          }
        }
      });
    });
  }

  ngOnInit() {}

  ionViewWillEnter() {
    this.title.setTitle('Check Attendance');
  }

  titleSelected() {
    this.location.go('/check-weekly-att?title=' + this.selectTitle.title);
    const q = query(
      ref(this.db, 'new_online_attendance2022/atts'),
      orderByChild('title'),
      equalTo(this.selectTitle.title)
    );
    onValue(q, (ss) => {
      let data: any[] = [];
      if (ss.exists()) {
        data = Object.values(ss.val());
      }

      this.arrAtt = data.sort((obj1, obj2) => {
        if (obj1['smallTeam'] > obj2['smallTeam']) {
          return 1;
        } else if (obj1['smallTeam'] < obj2['smallTeam']) {
          return -1;
        } else {
          if (obj1['CGnumber'] > obj2['CGnumber']) {
            return 1;
          } else if (obj1['CGnumber'] < obj2['CGnumber']) {
            return -1;
          } else {
            if (obj1['CG'] > obj2['CG']) {
              return 1;
            } else if (obj1['CG'] < obj2['CG']) {
              return -1;
            }
          }
        }
        return 0;
      });

      this.attCG.reset();
      this.attService.reset();
      for (let att of this.arrAtt) {
        att.attCG['gOM'] = att.attCG.arr.filter(
          (num) => num.attendance == 1 && num.method == 0
        ).length;
        att.attCG['sOM'] = att.attCG.arr.filter(
          (num) => num.attendance == 1 && num.method == 1
        ).length;
        att.attCG['gNB'] = att.attCG.methodNB
          ? att.attCG.methodNB.filter((m) => m == 0).length
          : 0;
        att.attCG['sNB'] = att.attCG.methodNB
          ? att.attCG.methodNB.filter((m) => m == 1).length
          : 0;
        att.attCG['gAC'] = att.attCG.methodAC
          ? att.attCG.methodAC.filter((m) => m == 0).length
          : 0;
        att.attCG['sAC'] = att.attCG.methodAC
          ? att.attCG.methodAC.filter((m) => m == 1).length
          : 0;
        att.attCG['gNF'] = att.attCG.methodNF
          ? att.attCG.methodNF.filter((m) => m == 0).length
          : 0;
        att.attCG['sNF'] = att.attCG.methodNF
          ? att.attCG.methodNF.filter((m) => m == 1).length
          : 0;
        att.attCG['gRNF'] = att.attCG.methodRNF
          ? att.attCG.methodRNF.filter((m) => m == 0).length
          : 0;
        att.attCG['sRNF'] = att.attCG.methodRNF
          ? att.attCG.methodRNF.filter((m) => m == 1).length
          : 0;

        att.attService['gOM'] = att.attService.arr.filter(
          (num) => num.attendance == 1 && num.method == 0
        ).length;
        att.attService['sOM'] = att.attService.arr.filter(
          (num) => num.attendance == 1 && num.method == 1
        ).length;
        att.attService['gNB'] =
          att.attService.NB == 0
            ? 0
            : att.attService.methodNB.filter((m) => m == 0).length;
        att.attService['sNB'] =
          att.attService.NB == 0
            ? 0
            : att.attService.methodNB.filter((m) => m == 1).length;
        att.attService['gAC'] =
          att.attService.AC == 0
            ? 0
            : att.attService.methodAC.filter((m) => m == 0).length;
        att.attService['sAC'] =
          att.attService.AC == 0
            ? 0
            : att.attService.methodAC.filter((m) => m == 1).length;
        att.attService['gNF'] =
          att.attService.NF == 0
            ? 0
            : att.attService.methodNF.filter((m) => m == 0).length;
        att.attService['sNF'] =
          att.attService.NF == 0
            ? 0
            : att.attService.methodNF.filter((m) => m == 1).length;
        att.attService['gRNF'] =
          att.attService.RNF == 0
            ? 0
            : att.attService.methodRNF.filter((m) => m == 0).length;
        att.attService['sRNF'] =
          att.attService.RNF == 0
            ? 0
            : att.attService.methodRNF.filter((m) => m == 1).length;

        this.attCG.ground.cntOM += att.attCG['gOM'];
        this.attCG.ground.cntNB += att.attCG['gNB'];
        this.attCG.ground.cntAC += att.attCG['gAC'];
        this.attCG.ground.cntNF += att.attCG['gNF'];
        this.attCG.ground.cntRNF += att.attCG['gRNF'];
        this.attCG.sky.cntOM += att.attCG['sOM'];
        this.attCG.sky.cntNB += att.attCG['sNB'];
        this.attCG.sky.cntAC += att.attCG['sAC'];
        this.attCG.sky.cntNF += att.attCG['sNF'];
        this.attCG.sky.cntRNF += att.attCG['sRNF'];
        this.attCG.cntAbs += att.attCG['Abs'];

        this.attService.ground.cntOM += att.attService['gOM'];
        this.attService.ground.cntNB += att.attService['gNB'];
        this.attService.ground.cntAC += att.attService['gAC'];
        this.attService.ground.cntNF += att.attService['gNF'];
        this.attService.ground.cntRNF += att.attService['gRNF'];
        this.attService.sky.cntOM += att.attService['sOM'];
        this.attService.sky.cntNB += att.attService['sNB'];
        this.attService.sky.cntAC += att.attService['sAC'];
        this.attService.sky.cntNF += att.attService['sNF'];
        this.attService.sky.cntRNF += att.attService['sRNF'];
        this.attService.cntAbs += att.attService['Abs'];
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
