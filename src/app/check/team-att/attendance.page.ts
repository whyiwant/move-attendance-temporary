import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { log } from 'firebase-functions/logger';
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
  t: number = 0;
  cntOM: number = 0;
  cntNB: number = 0;
  cntAC: number = 0;
  cntNF: number = 0;
  cntRNF: number = 0;
  cntAbs: number = 0;

  get total() {
    return this.cntOM + this.cntNB + this.cntAC + this.cntNF + this.cntRNF;
  }

  reset() {
    this.cntOM = 0;
    this.cntNB = 0;
    this.cntAC = 0;
    this.cntNF = 0;
    this.cntRNF = 0;
    this.cntAbs = 0;
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

  get total() {
    return this.sky.total + this.ground.total;
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

  cluster: any;
  smallTeam: any;
  cg: any;

  arrCluster: any[] = [];
  arrST: any[] = [];

  arrCG = [];
  arrTitle = [];
  arrAtt = [];
  arrNum = [];

  selectTitle: any;

  attCG: Att = new Att();
  attDev: Att = new Att();
  attService: Att = new Att();

  arrFilteredAtt: {
    title: any;
    attCG: Att;
    attDev: Att;
    attService: Att;
  }[] = [];

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
      console.log('arrTitle');
    });

    const clusterRef = ref(this.db, 'new_online_attendance2022/clusters');
    onValue(clusterRef, (snapShot) => {
      this.arrCluster = snapShot.val();
    });

    const cgRef = ref(this.db, 'new_online_attendance2022/CGs');
    onValue(cgRef, (snapShot) => {
      this.arrCG = Object.values(snapShot.val());
    });

    const attRef = ref(this.db, 'new_online_attendance2022/atts');
    onValue(attRef, (s) => {
      this.arrAtt = Object.values(s.val());
      console.log('arrAtt');
    });
  }

  ngOnInit() {}

  ionViewWillEnter() {
    this.title.setTitle('Team');
  }

  clusterSelected() {
    // console.log(this.cluster);
    this.smallTeam = null;
    this.arrST = [];

    for (let k = 0; k < this.cluster.value; k++) {
      this.arrST.push(this.cluster.key + ' ' + (k + 1));
    }
  }

  stSelected() {
    this.cg = null;
  }

  checkCluster(c) {
    if (!this.cluster) return true;
    return this.cluster.key == c;
  }

  checkST(st) {
    if (!this.smallTeam) return true;
    return st == this.smallTeam;
  }

  checkCG(CG) {
    if (!this.cg) return true;
    return CG == this.cg;
  }

  showTotalAtt() {
    this.arrFilteredAtt = [];

    for (let title of this.arrTitle) {
      if (title.title == '211227-220102') {
        break;
      }
      this.attCG.reset();
      this.attDev.reset();
      this.attService.reset();
      for (let att of this.arrAtt) {
        if (
          title.title == att.title &&
          this.checkCluster(att.cluster) &&
          this.checkST(att.smallTeam) &&
          this.checkCG(att.CG)
        ) {
          // var att = att.attNorCG;
          // tAttNorCG.t += parseInt(att.Total);
          // tAttNorCG.tOM += parseInt(att.OM);
          // tAttNorCG.tNB += parseInt(att.NB);
          // tAttNorCG.tAC += parseInt(att.AC);
          // tAttNorCG.tRNF += parseInt(att.RNF);
          // tAttNorCG.tNF += parseInt(att.NF);
          // tAttNorCG.tAbs += parseInt(att.Abs);

          // var att = v.attDis;
          // tAttDis.t += parseInt(att.Total);
          // tAttDis.tOM += parseInt(att.OM);
          // tAttDis.tNB += parseInt(att.NB);
          // tAttDis.tAC += parseInt(att.AC);
          // tAttDis.tRNF += parseInt(att.RNF);
          // tAttDis.tNF += parseInt(att.NF);
          // tAttDis.tAbs += parseInt(att.Abs);

          // var attDev = att.attDev;
          // tAttDev.t += parseInt(att.Total);
          this.attDev.ground.cntOM += parseInt(att.attDev.OM);
          this.attDev.ground.cntNB += parseInt(att.attDev.NB);
          this.attDev.ground.cntAC += parseInt(att.attDev.AC);
          this.attDev.ground.cntRNF += parseInt(att.attDev.RNF);
          this.attDev.ground.cntNF += parseInt(att.attDev.NF);
          this.attDev.ground.cntAbs += parseInt(att.attDev.Abs);

          // var att = v.attOut;
          // tAttOut.t += parseInt(att.attOut.Total);
          // tAttOut.tOM += parseInt(att.attOut.OM);
          // tAttOut.tNB += parseInt(att.attOut.NB);
          // tAttOut.tAC += parseInt(att.attOut.AC);
          // tAttOut.tRNF += parseInt(att.attOut.RNF);
          // tAttOut.tNF += parseInt(att.attOut.NF);
          // tAttOut.tAbs += parseInt(att.attOut.Abs);

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
      }

      this.attDev.ground.t = this.attDev.ground.total;
      this.attDev.sky.t = this.attDev.sky.total;

      this.attCG.ground.t = this.attCG.ground.total;
      this.attCG.sky.t = this.attCG.sky.total;

      this.attService.ground.t = this.attService.ground.total;
      this.attService.sky.t = this.attService.sky.total;

      this.arrFilteredAtt.push({
        title,
        attCG: JSON.parse(JSON.stringify(this.attCG)),
        attDev: JSON.parse(JSON.stringify(this.attDev)),
        attService: JSON.parse(JSON.stringify(this.attService)),
      });
    }
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
