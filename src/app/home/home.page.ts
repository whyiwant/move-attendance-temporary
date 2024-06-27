/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable prefer-const */
import {
  AfterViewInit,
  Component,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import {
  IonInput,
  IonModal,
  LoadingController,
  ModalController,
  PopoverController,
} from '@ionic/angular';
import { ConfirmAttComponent } from '../popover/confirm-att/confirm-att.component';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Database,
  DatabaseReference,
  equalTo,
  get,
  getDatabase,
  onValue,
  orderByChild,
  query,
  ref,
  set,
} from 'firebase/database';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Auth, getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {
  db: Database;
  ref: DatabaseReference;

  // eslint-disable-next-line @typescript-eslint/naming-convention
  GROUND = '0';
  // eslint-disable-next-line @typescript-eslint/naming-convention
  SKY = '1';

  // arrAttSection = ['NorCG', 'Dis', 'Dev', 'Out', 'CG', 'Service', 'W'];
  arrAttSection = ['CG', 'Dev', 'Service', 'W'];

  arrCG = [];
  arrTitle = [];
  arrTitleForTitles = {};
  arrAtt = [];
  arrNum = [];
  arrAutoComplete: string[] = [];

  selectCG: any;
  selectTitle: any;

  attNorCG = {
    cntOM: 0,
    cntNB: 0,
    cntNF: 0,
    cntRNF: 0,
    cntAC: 0,
    cntAbs: 0,
    namesNB: [],
    namesNF: [],
    namesRNF: [],
    namesAC: [],
    desAC: '',
    desAbs: '',
    desNB: '',
    desNF: '',
    desRNF: '',
  };
  attDis = JSON.parse(JSON.stringify(this.attNorCG));
  attDev = JSON.parse(JSON.stringify(this.attNorCG));
  attOut = JSON.parse(JSON.stringify(this.attNorCG));
  attCG = JSON.parse(JSON.stringify(this.attNorCG));
  attService = JSON.parse(JSON.stringify(this.attNorCG));
  attW = JSON.parse(JSON.stringify(this.attNorCG));

  arrFlwUp = {
    OM: {},
    NB: [],
    NF: [],
    RNF: [],
  };

  // private ref: DatabaseReference;

  @ViewChild(IonModal) modal: IonModal | undefined;
  @ViewChildren('nameRef')
  components!: QueryList<IonInput>;
  @ViewChild('name_datalist') datalist;

  auth!: Auth;
  name: string | null = '';

  constructor(
    // private db: AngularFireDatabase,
    public popoverController: PopoverController,
    private modelCtrl: ModalController,
    private title: Title,
    private location: Location,
    private route: ActivatedRoute,
    private load: LoadingController,
    private http: HttpClient,
    private router: Router
  ) {
    this.auth = getAuth();
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        console.log(user);

        const uid = user.uid;
        console.log(user.displayName);
        console.log(user.phoneNumber);
        if (user.displayName) {
          this.name = user.displayName;
        } else if (user.email) {
          this.name = user.email;
        } else {
          this.name = user.phoneNumber;
        }
      } else {
        console.log('No user.');
        router.navigate(['']);
      }
    });

    title.setTitle('Submit Attendance');

    this.db = getDatabase();
    this.ref = ref(this.db, 'new_online_attendance2022');

    onValue(ref(this.db, 'new_online_attendance2022/CGs'), (ss1) => {
      this.arrCG = Object.values(ss1.val());
      onValue(ref(this.db, 'new_online_attendance2022/titles'), (ss2) => {
        this.arrTitleForTitles = ss2.val();
        this.arrTitle = Object.values(ss2.val());
        this.arrTitle = this.arrTitle.reverse();
        this.route.queryParams.subscribe((params) => {
          if (params.CG) {
            for (let cg of this.arrCG) {
              if (cg.CG == params.CG) {
                this.selectCG = cg;
                this.change(null); // simulate CG selected
              }
            }
          }
        });
      });
    });

    // db.list('new_online_attendance2022/CGs')
    //   .valueChanges()
    //   .subscribe((data) => {
    //     this.arrCG = data;
    //     db.list('new_online_attendance2022/titles')
    //       .valueChanges()
    //       .subscribe((d) => {
    //         this.arrTitle = d;
    //         this.arrTitle = this.arrTitle.reverse();
    //         this.route.queryParams.subscribe((params) => {
    //           if (params.CG) {
    //             for (let cg of this.arrCG) {
    //               if (cg.CG == params.CG) {
    //                 this.selectCG = cg;
    //                 this.change(null); // simulate CG selected
    //               }
    //             }
    //           }
    //         });
    //       });
    //   });

    // init service method (ground/sky)
    this.attService.methodNB = [];
    this.attService.methodNF = [];
    this.attService.methodRNF = [];
    this.attService.methodAC = [];
  }

  ngAfterViewInit(): void {
    console.log(this.datalist);

    onValue(
      ref(this.db, 'new_online_attendance2022/autoCompletes'),
      (snapshot) => {
        this.arrAutoComplete = Object.values(snapshot.val());
        for (let n of this.arrAutoComplete) {
          var option: HTMLOptionElement = new Option();
          option.value = n;
          this.datalist.nativeElement.appendChild(option);
        }
        this.components.changes.subscribe((elements) => {
          // console.log(elements);
          elements.forEach((element) => {
            // console.log(element);
            element.getInputElement().then((e) => {
              e.setAttribute('list', 'name_datalist');
            });
          });
        });
      }
    );

    // this.db
    //   .list('new_online_attendance2022/autoCompletes')
    //   .valueChanges()
    //   .subscribe((data) => {
    //     this.arrAutoComplete = data as string[];
    //     for (let n of this.arrAutoComplete) {
    //       var option: HTMLOptionElement = new Option();
    //       option.value = n;
    //       this.datalist.nativeElement.appendChild(option);
    //     }
    //     this.components.changes.subscribe((elements) => {
    //       // console.log(elements);
    //       elements.forEach((element) => {
    //         // console.log(element);
    //         element.getInputElement().then((e) => {
    //           e.setAttribute('list', 'name_datalist');
    //         });
    //       });
    //     });
    //     // let elements = elementRef.nativeElement.querySelectorAll('.names');
    //   });
  }

  get filteredCG() {
    return this.arrCG
      .filter((x) => !x.del)
      .sort((obj1, obj2) => {
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

  async change(e) {
    const loading = await this.load.create({
      message: 'Loading...',
      spinner: 'lines-sharp',
    });

    loading.present();

    this.location.go('/home?CG=' + this.selectCG.CG);

    this.attNorCG = {
      cntOM: 0,
      cntNB: 0,
      cntNF: 0,
      cntRNF: 0,
      cntAC: 0,
      cntAbs: 0,
      namesNB: [],
      namesNF: [],
      namesRNF: [],
      namesAC: [],
      desAC: '',
      desAbs: '',
      desNB: '',
      desNF: '',
      desRNF: '',
    };
    this.attDis = JSON.parse(JSON.stringify(this.attNorCG));
    this.attDev = JSON.parse(JSON.stringify(this.attNorCG));
    this.attOut = JSON.parse(JSON.stringify(this.attNorCG));
    this.attCG = JSON.parse(JSON.stringify(this.attNorCG));
    this.attService = JSON.parse(JSON.stringify(this.attNorCG));
    this.attW = JSON.parse(JSON.stringify(this.attNorCG));

    this.attCG.methodNB = [];
    this.attCG.methodNF = [];
    this.attCG.methodRNF = [];
    this.attCG.methodAC = [];

    this.attService.methodNB = [];
    this.attService.methodNF = [];
    this.attService.methodRNF = [];
    this.attService.methodAC = [];

    this.arrFlwUp = {
      OM: {},
      NB: [],
      NF: [],
      RNF: [],
    };

    this.selectTitle = this.arrTitle[0].title;

    // this.db.list('new_online_attendance2022/atts').valueChanges().subscribe(d => {
    //   let end = new Date();
    //   const diffTime = Math.abs(end.getTime() - s.getTime());
    //   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    //   console.log(diffTime + " milliseconds for all");
    //   alert(this['diffTime'] + " " + diffTime);
    // });

    const numberingRef = query(
      ref(this.db, 'new_online_attendance2022/numberings'),
      orderByChild('CG'),
      equalTo(this.selectCG.CG)
    );
    onValue(numberingRef, (snapshot) => {
      const data = snapshot.val();
      const keys = Object.keys(data);

      this.arrNum = keys.map((key) => ({ id: key, ...data[key] }));

      for (let num of this.arrNum) {
        for (let att of this.arrAttSection) {
          num['att' + att] = {
            name: num.Name,
            attendance: '1',
            reason: '',
          };
          if (att == 'Dis' || att == 'Dev' || att == 'Out') {
            num['att' + att].attendance = '0';
          }
          if (att == 'CG' || att == 'Service') {
            num['att' + att].method = this.GROUND;
          }
          // num['att' + att].attendance = '1';
        }
        this.arrFlwUp.OM[num.id] = {
          by: '-',
          name: num.Name,
          status: 'Did not disciple',
        };
      }

      loading.dismiss();
    });

    // this.db
    //   .list('new_online_attendance2022/numberings', (ref) =>
    //     ref.orderByChild('CG').equalTo(this.selectCG.CG)
    //   )
    //   .valueChanges(null, { idField: 'id' })
    //   .subscribe((d) => {
    //     this.arrNum = d;
    //     for (let num of this.arrNum) {
    //       for (let att of this.arrAttSection) {
    //         num['att' + att] = {
    //           name: num.Name,
    //           attendance: '1',
    //           reason: '',
    //         };
    //         if (att == 'Dis' || att == 'Dev' || att == 'Out') {
    //           num['att' + att].attendance = '0';
    //         }
    //         if (att == 'CG' || att == 'Service') {
    //           num['att' + att].method = this.GROUND;
    //         }
    //         // num['att' + att].attendance = '1';
    //       }
    //       this.arrFlwUp.OM[num.id] = {
    //         by: '-',
    //         name: num.Name,
    //         status: 'Did not disciple',
    //       };
    //     }

    //     loading.dismiss();
    //   });

    const attRef = query(
      ref(this.db, 'new_online_attendance2022/atts'),
      orderByChild('CG'),
      equalTo(this.selectCG.CG)
    );
    onValue(attRef, (snapshot) => {
      this.arrAtt = Object.values(snapshot.val());
      this.arrAtt.reverse();
    });

    // let s = new Date();
    // this.db
    //   .list('new_online_attendance2022/atts', (ref) =>
    //     ref.orderByChild('CG').equalTo(this.selectCG.CG)
    //   )
    //   .valueChanges()
    //   .subscribe((d) => {
    //     this.arrAtt = d;
    //     this.arrAtt.reverse();

    //     // let end = new Date();
    //     // this['diffTime'] = Math.abs(end.getTime() - s.getTime());
    //   });
  }

  cntChange(att: any, sts: any) {
    let cnt = this['att' + att]['cnt' + sts];
    let names = this['att' + att]['names' + sts];

    while (cnt > names.length) {
      names.push('');
    }

    if (att == 'Dis') {
      while (cnt > this.arrFlwUp[sts].length) {
        this.arrFlwUp[sts].push({
          by: '',
          name: '',
          status: '',
        });
      }
    }

    if (att == 'CG' || att == 'Service') {
      let methods = this['att' + att]['method' + sts];
      while (cnt > methods.length) {
        methods.push(this.GROUND);
      }
    }
  }

  trackByIdx(index: number, obj: any): any {
    return index;
  }

  get absCG() {
    let arrAttCG = ['NorCG', 'Dis', 'Dev', 'Out'];
    let arrAbsCG = [];
    for (let k of this.arrNum) {
      let isAbsCG = true;
      for (let j of arrAttCG) {
        if (k['att' + j].attendance == '1') {
          isAbsCG = false;
        }
      }
      if (isAbsCG) {
        arrAbsCG.push(k);
      }
    }
    return arrAbsCG;
  }

  proper(str: any): string {
    return str
      .trim()
      .toLowerCase()
      .replace(/\b(\w)/g, (s: string) => s.toUpperCase());
  }

  // append names into set to get unique names
  getNamesOf(_att, _status) {
    let _set = new Set();
    let _cnt = _att['cnt' + _status];
    if (_cnt != 0) {
      for (let k of Object.values(_att['names' + _status]).slice(0, _cnt)) {
        _set.add(this.proper(k));
      }
    }
    return _set;
  }

  writeAtt(att: any, pathAtt: string) {
    let desNB = '';
    let desNF = '';
    let desRNF = '';
    let desAC = '';

    if (att.cntNB != 0) {
      for (var j = 0; j < att.cntNB; j++)
        att.namesNB[j] = this.proper(att.namesNB[j]);
      desNB =
        '(' + Object.values(att.namesNB).slice(0, att.cntNB).join(', ') + ')';
    }

    if (att.cntNF != 0) {
      for (var j = 0; j < att.cntNF; j++)
        att.namesNF[j] = this.proper(att.namesNF[j]);
      desNF =
        '(' + Object.values(att.namesNF).slice(0, att.cntNF).join(', ') + ')';
    }

    if (att.cntRNF != 0) {
      for (var j = 0; j < att.cntRNF; j++)
        att.namesRNF[j] = this.proper(att.namesRNF[j]);
      desRNF =
        '(' + Object.values(att.namesRNF).slice(0, att.cntRNF).join(', ') + ')';
    }

    if (att.cntAC != 0) {
      for (var j = 0; j < att.cntAC; j++)
        att.namesAC[j] = this.proper(att.namesAC[j]);
      desAC =
        '(' + Object.values(att.namesAC).slice(0, att.cntAC).join(', ') + ')';
    }

    // generate numbering att array
    let arrNumberingAtt = [];
    for (let num of this.arrNum) {
      arrNumberingAtt.push(num[pathAtt]);
    }

    let json = {
      title: this.selectTitle,
      CG: this.selectCG.CG,
      CGnumber: this.selectCG.CGnumber,
      Total: att.cntOM + att.cntNB + att.cntAC + att.cntNF + att.cntRNF,
      OM: att.cntOM,
      NB: att.cntNB ? att.cntNB : 0,
      AC: att.cntAC ? att.cntAC : 0,
      NF: att.cntNF ? att.cntNF : 0,
      RNF: att.cntRNF ? att.cntRNF : 0,
      Abs: att.cntAbs,
      cluster: this.selectCG.cluster,
      smallTeam: this.selectCG.smallTeam,
      desNB: desNB,
      desAC: desAC,
      desNF: desNF,
      desRNF: desRNF,
      desAbs: '(' + att.desAbs.slice(0, att.desAbs.length - 2) + ')',
      arr: arrNumberingAtt,
    };

    console.log(att);

    if (att.cntNB != 0) {
      json['namesNB'] = Object.values(att.namesNB).slice(0, att.cntNB);
      if (att.methodNB != null) {
        json['methodNB'] = Object.values(att.methodNB).slice(0, att.cntNB);
      }
    }

    if (att.cntNF != 0) {
      json['namesNF'] = Object.values(att.namesNF).slice(0, att.cntNF);
      if (att.methodNF != null) {
        json['methodNF'] = Object.values(att.methodNF).slice(0, att.cntNF);
      }
    }

    if (att.cntRNF != 0) {
      json['namesRNF'] = Object.values(att.namesRNF).slice(0, att.cntRNF);
      if (att.methodRNF != null) {
        json['methodRNF'] = Object.values(att.methodRNF).slice(0, att.cntRNF);
      }
    }

    if (att.cntAC != 0) {
      json['namesAC'] = Object.values(att.namesAC).slice(0, att.cntAC);
      if (att.methodAC != null) {
        json['methodAC'] = Object.values(att.methodAC).slice(0, att.cntAC);
      }
    }

    // this.ref.child('atts').child(this.sprCG.CG + '@' + this.sprTitle.$value).child(pathAtt).set(json);
    return json;
  }

  writeFlwUp(status) {
    let arrFlwUp = [];
    let _cnt = this.attDis['cnt' + status];
    // alert(_cnt);
    if (_cnt != 0) {
      for (let k = 0; k < _cnt; k++) {
        // alert(k);
        let flwUp = {
          name: this.attDis['names' + status][k],
          status: this.arrFlwUp[status][k].status,
          by: this.arrFlwUp[status][k].by,
        };
        // alert("Afetr flw p");
        arrFlwUp.push(flwUp);
        // alert(flwUp.status + "\n" + flwUp.by);
      }
    }

    // ref.child('atts').child(this.sprCG.CG + '@' + this.sprTitle.$value).child('flwUp').child(status).set(arrFlwUp);

    return arrFlwUp;
  }

  async submit(e) {
    for (let att of this.arrAttSection) {
      this['att' + att].cntOM = 0;
      this['att' + att].cntAbs = 0;
      this['att' + att].desAbs = '';
    }

    let setNB = new Set([
      ...this.getNamesOf(this.attNorCG, 'NB'),
      ...this.getNamesOf(this.attDis, 'NB'),
      ...this.getNamesOf(this.attDev, 'NB'),
      ...this.getNamesOf(this.attOut, 'NB'),
    ]);

    let setNF = new Set([
      ...this.getNamesOf(this.attNorCG, 'NF'),
      ...this.getNamesOf(this.attDis, 'NF'),
      ...this.getNamesOf(this.attDev, 'NF'),
      ...this.getNamesOf(this.attOut, 'NF'),
    ]);

    let setRNF = new Set([
      ...this.getNamesOf(this.attNorCG, 'RNF'),
      ...this.getNamesOf(this.attDis, 'RNF'),
      ...this.getNamesOf(this.attDev, 'RNF'),
      ...this.getNamesOf(this.attOut, 'RNF'),
    ]);

    let setAC = new Set([
      ...this.getNamesOf(this.attNorCG, 'AC'),
      ...this.getNamesOf(this.attDis, 'AC'),
      ...this.getNamesOf(this.attDev, 'AC'),
      ...this.getNamesOf(this.attOut, 'AC'),
    ]);

    // corner cases, status will change to NB after AC
    // should show AC in weekly total if NF/RNF ACed
    for (let k of setAC) {
      if (setNB.has(k)) setNB.delete(k);
      if (setNF.has(k)) setNF.delete(k);
      if (setRNF.has(k)) setRNF.delete(k);
    }

    // convert to proper data for attCG
    // this.attCG.cntNB = setNB.size;
    // this.attCG.cntNF = setNF.size;
    // this.attCG.cntRNF = setRNF.size;
    // this.attCG.cntAC = setAC.size;
    // this.attCG.namesNB = Object.assign({}, Array.from(setNB));
    // this.attCG.namesNF = Object.assign({}, Array.from(setNF));
    // this.attCG.namesRNF = Object.assign({}, Array.from(setRNF));
    // this.attCG.namesAC = Object.assign({}, Array.from(setAC));

    let setNBw = new Set([...setNB, ...this.getNamesOf(this.attService, 'NB')]);
    let setNFw = new Set([...setNF, ...this.getNamesOf(this.attService, 'NF')]);
    let setRNFw = new Set([
      ...setRNF,
      ...this.getNamesOf(this.attService, 'RNF'),
    ]);
    let setACw = new Set([...setAC, ...this.getNamesOf(this.attService, 'AC')]);

    // corner cases, status will change to NB after AC
    // should show AC in weekly total if NF/RNF ACed
    for (let k of setACw) {
      // alert(setNB.has(k));
      if (setNBw.has(k)) setNBw.delete(k);
      if (setNFw.has(k)) setNFw.delete(k);
      if (setRNFw.has(k)) setRNFw.delete(k);
    }

    // convert to proper data for attW
    this.attW.cntNB = setNBw.size;
    this.attW.cntNF = setNFw.size;
    this.attW.cntRNF = setRNFw.size;
    this.attW.cntAC = setACw.size;
    this.attW.namesNB = Object.assign({}, Array.from(setNBw));
    this.attW.namesNF = Object.assign({}, Array.from(setNFw));
    this.attW.namesRNF = Object.assign({}, Array.from(setRNFw));
    this.attW.namesAC = Object.assign({}, Array.from(setACw));

    // console.log(this.attNorCG);
    // console.log(this.attDis);
    // console.log(this.attDev);
    // console.log(this.attOut);
    // console.log(this.attService);
    // console.log(this.arrNum);
    // console.log(this.arrFlwUp);

    for (let num of this.arrNum) {
      let isCGabsent = num.attCG.attendance == 0;
      // = num.attNorCG.attendance == 0 && num.attDis.attendance == 0
      // && num.attDev.attendance == 0 && num.attOut.attendance == 0;

      let isWeeklyabsent =
        num.attCG.attendance == 0 &&
        num.attDev.attendance &&
        num.attService.attendance == '0';

      if (isWeeklyabsent) {
        num.attW.attendance = '0';
        num.attW.reason = num.attCG.reason;
      } else num.attW.attendance = '1';

      // if (isCGabsent) num.attCG.attendance = '0';
      // else num.attCG.attendance = '1';

      for (let att of this.arrAttSection) {
        if (num['att' + att].attendance == '1') {
          this['att' + att].cntOM++;
        } else {
          this['att' + att].cntAbs++;
          if (att == 'CG' || att == 'Service' || att == 'W') {
            this['att' + att].desAbs +=
              num.Name + ' - ' + num['att' + att].reason + ', ';
          } else {
            this['att' + att].desAbs += num.Name + ', ';
          }
        }
      }
    }

    for (let j = 0; j < this.attDis.namesNB.length; j++) {
      this.arrFlwUp.NB[j].name = this.attDis.namesNB[j];
    }
    for (let j = 0; j < this.attDis.namesNF.length; j++) {
      this.arrFlwUp.NF[j].name = this.attDis.namesNF[j];
    }
    for (let j = 0; j < this.attDis.namesRNF.length; j++) {
      this.arrFlwUp.RNF[j].name = this.attDis.namesRNF[j];
    }

    let d = new Date();
    let timeStamp =
      d.getFullYear() +
      '.' +
      (d.getMonth() + 1) +
      '.' +
      d.getDate() +
      ' ' +
      d.getHours() +
      ':' +
      d.getMinutes() +
      ':' +
      d.getSeconds();

    let json = {
      CG: this.selectCG.CG,
      CGnumber: this.selectCG.CGnumber,
      // attNorCG: this.writeAtt(this.attNorCG, 'attNorCG'),
      // attDis: this.writeAtt(this.attDis, 'attDis'),
      attDev: this.writeAtt(this.attDev, 'attDev'),
      // attOut: this.writeAtt(this.attOut, 'attOut'),
      attCG: this.writeAtt(this.attCG, 'attCG'),
      attService: this.writeAtt(this.attService, 'attService'),
      attW: this.writeAtt(this.attW, 'attW'),
      cluster: this.selectCG.cluster,
      flwUp: this.arrFlwUp,
      smallTeam: this.selectCG.smallTeam,
      timeStamp: timeStamp,
      title: this.selectTitle,
      source: 'new',
    };

    const modal = await this.modelCtrl.create({
      component: ConfirmAttComponent,
      // event: e,
      // translucent: true,
      backdropDismiss: false, // disable dismiss when clicked outside the popover
      componentProps: { att: json }, // this is to pass data to the popover component
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();

    if (role !== 'confirm') {
      return;
    }

    get(
      ref(
        this.db,
        'new_online_attendance2022/atts/' +
          this.selectCG.CG +
          '@' +
          this.selectTitle
      )
    ).then((snapshot) => {
      if (snapshot.exists()) {
        set(
          ref(
            this.db,
            'new_online_attendance2022/backup/' + Date.now().toString()
          ),
          {
            att: snapshot.val(),
            timeStamp: timeStamp,
          }
        ).then(() => {
          set(
            ref(
              this.db,
              'new_online_attendance2022/atts/' +
                this.selectCG.CG +
                '@' +
                this.selectTitle
            ),
            json
          ).then(() => {
            alert('Attendance submitted.');

            // notify attendance submitted
            var headers = new HttpHeaders();
            headers.append('Accept', 'application/json');
            headers.append('Content-Type', 'application/json');
            this.http
              .post(
                'https://us-central1-online-payment-5e504.cloudfunctions.net/notificationService/attendance-submitted',
                { cg: this.selectCG.CG },
                { headers }
              )
              .subscribe({
                next: (v) => console.log(v),
                error: (e) => console.log(e),
                complete: () => console.log('Completed'),
              });
          });
        });
      } else {
        set(
          ref(
            this.db,
            'new_online_attendance2022/atts/' +
              this.selectCG.CG +
              '@' +
              this.selectTitle
          ),
          json
        ).then(() => {
          alert('Attendance submitted.');
        });
      }
    });

    // this.db.database
    //   .ref(
    //     'new_online_attendance2022/atts/' +
    //       this.selectCG.CG +
    //       '@' +
    //       this.selectTitle
    //   )
    //   .once('value')
    //   .then((dddd) => {
    //     let val = dddd.val();
    //     if (val) {
    //       this.ref
    //         .child('backup')
    //         .child(Date.now().toString())
    //         .set({ att: val, timeStamp: timeStamp })
    //         .then(() => {
    //           this.ref
    //             .child('atts')
    //             .child(this.selectCG.CG + '@' + this.selectTitle)
    //             .set(json)
    //             .then(() => {
    //               alert('Attendance submitted.');
    //             });
    //         });
    //     } else {
    //       this.ref
    //         .child('atts')
    //         .child(this.selectCG.CG + '@' + this.selectTitle)
    //         .set(json)
    //         .then(() => {
    //           alert('Attendance submitted.');
    //         });
    //     }
    //   });

    // this.db.list('new_online_attendance2022/atts/' + this.selectCG.CG + '@' + this.selectTitle).snapshotChanges()
    //   .pipe(take(1))
    //   .subscribe(past => {
    //     console.log(past);
    //     if (past.length != 0) {
    //       console.log((Date.now()).toString());
    //       this.ref.child('backup').child(Date.now().toString()).set(json);
    //     }
    //   });

    for (let num of this.arrNum) {
      // this.ref.child('personal_attendance').child(num.id).child(this.selectTitle).child('norCG').set({
      //   attendance: num.attNorCG.attendance
      // });

      // this.ref.child('personal_attendance').child(num.id).child(this.selectTitle).child('dis').set({
      //   attendance: num.attDis.attendance
      // });

      set(
        ref(
          this.db,
          'new_online_attendance2022/personal_attendance/' +
            num.id +
            '/' +
            this.selectTitle +
            '/dev'
        ),
        {
          attendance: num.attDev.attendance,
        }
      );

      // this.ref
      //   .child('personal_attendance')
      //   .child(num.id)
      //   .child(this.selectTitle)
      //   .child('dev')
      //   .set({
      //     attendance: num.attDev.attendance,
      //   });

      // this.ref.child('personal_attendance').child(num.id).child(this.selectTitle).child('out').set({
      //   attendance: num.attOut.attendance
      // });

      set(
        ref(
          this.db,
          'new_online_attendance2022/personal_attendance/' +
            num.id +
            '/' +
            this.selectTitle +
            '/CG'
        ),
        {
          attendance: num.attCG.attendance,
          reason: num.attCG.reason,
          method: num.attCG.method,
        }
      );

      set(
        ref(
          this.db,
          'new_online_attendance2022/personal_attendance/' +
            num.id +
            '/' +
            this.selectTitle +
            '/service'
        ),
        {
          attendance: num.attService.attendance,
          reason: num.attService.reason,
          method: num.attService.method,
        }
      );

      set(
        ref(
          this.db,
          'new_online_attendance2022/personal_attendance/' +
            num.id +
            '/' +
            this.selectTitle +
            '/w'
        ),
        {
          attendance: num.attW.attendance,
          reason: num.attW.reason,
        }
      );

      // this.ref
      //   .child('personal_attendance')
      //   .child(num.id)
      //   .child(this.selectTitle)
      //   .child('CG')
      //   .set({
      //     attendance: num.attCG.attendance,
      //     reason: num.attCG.reason,
      //     method: num.attCG.method,
      //   });

      // this.ref
      //   .child('personal_attendance')
      //   .child(num.id)
      //   .child(this.selectTitle)
      //   .child('service')
      //   .set({
      //     attendance: num.attService.attendance,
      //     reason: num.attService.reason,
      //     method: num.attService.method,
      //   });

      // this.ref
      //   .child('personal_attendance')
      //   .child(num.id)
      //   .child(this.selectTitle)
      //   .child('w')
      //   .set({
      //     attendance: num.attW.attendance,
      //     reason: num.attW.reason,
      //   });
    }
  }

  copyAttExceptDes(fromAtt: any, toAtt: any) {
    // fromAtt.OM = toAtt.cntOM;
    let arrSts = ['NB', 'NF', 'RNF', 'AC'];

    for (let s of arrSts) {
      toAtt['cnt' + s] = fromAtt[s];
      if (fromAtt['names' + s]) {
        toAtt['names' + s] = fromAtt['names' + s];
      } else {
        toAtt['names' + s] = [];
      }

      if (fromAtt['method' + s]) {
        toAtt['method' + s] = fromAtt['method' + s];
      }
    }
  }

  copyAtt(att: any) {
    // this.selectTitle = att.title;
    // this.copyAttExceptDes(att.attNorCG, this.attNorCG);
    // this.copyAttExceptDes(att.attDis, this.attDis);
    this.copyAttExceptDes(att.attDev, this.attDev);
    // this.copyAttExceptDes(att.attOut, this.attOut);
    this.copyAttExceptDes(att.attCG, this.attCG);
    this.copyAttExceptDes(att.attService, this.attService);

    this.arrFlwUp = att.flwUp;
    if (!this.arrFlwUp['OM']) {
      this.arrFlwUp['OM'] = {};
    }
    if (!this.arrFlwUp['NB']) {
      this.arrFlwUp['NB'] = [];
    }
    if (!this.arrFlwUp['NF']) {
      this.arrFlwUp['NF'] = [];
    }
    if (!this.arrFlwUp['RNF']) {
      this.arrFlwUp['RNF'] = [];
    }

    // for (let fromNum of att.attNorCG.arr) {
    //   for (let toNum of this.arrNum) {
    //     if (fromNum.name == toNum.Name) {
    //       toNum.attNorCG = fromNum;
    //     }
    //   }
    // }

    // for (let fromNum of att.attDis.arr) {
    //   for (let toNum of this.arrNum) {
    //     if (fromNum.name == toNum.Name) {
    //       toNum.attDis = fromNum;
    //     }
    //   }
    // }

    for (let fromNum of att.attDev.arr) {
      for (let toNum of this.arrNum) {
        if (fromNum.name == toNum.Name) {
          toNum.attDev = fromNum;
        }
      }
    }

    // for (let fromNum of att.attOut.arr) {
    //   for (let toNum of this.arrNum) {
    //     if (fromNum.name == toNum.Name) {
    //       toNum.attOut = fromNum;
    //     }
    //   }
    // }

    for (let fromNum of att.attCG.arr) {
      for (let toNum of this.arrNum) {
        if (fromNum.name == toNum.Name) {
          toNum.attCG = fromNum;
        }
      }
    }

    for (let fromNum of att.attService.arr) {
      for (let toNum of this.arrNum) {
        if (fromNum.name == toNum.Name) {
          toNum.attService = fromNum;
        }
      }
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

  // arrAutoCompleteResult = [];
  // @ViewChild(IonPopover) inlinePopover: IonPopover | undefined;

  // typingNames(e) {
  //   // console.log(this.arrAutoComplete);
  //   // console.log(e);

  //   if (e.detail.data == '') {
  //     this.inlinePopover.dismiss();
  //     return;
  //   }
  //   this.arrAutoCompleteResult = this.arrAutoComplete.filter((a) =>
  //     a.includes(e.detail.data)
  //   );

  //   this.inlinePopover.event = e;
  //   this.inlinePopover.present();
  // }
}
