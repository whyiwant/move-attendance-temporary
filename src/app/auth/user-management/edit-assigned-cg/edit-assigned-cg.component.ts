import { Component, Input, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ModalController } from '@ionic/angular';
import { log } from 'firebase-functions/logger';
import { getDatabase, onValue, ref, update } from 'firebase/database';

@Component({
  selector: 'app-edit-assigned-cg',
  templateUrl: './edit-assigned-cg.component.html',
  styleUrls: ['./edit-assigned-cg.component.scss'],
})
export class EditAssignedCGComponent implements OnInit {
  @Input() user: any;

  selectCG: any;
  arrCG = [];

  db: any;
  name!: string;

  constructor(private title: Title, private modalCtrl: ModalController) {
    this.db = getDatabase();

    const cgRef = ref(this.db, 'new_online_attendance2022/CGs');
    onValue(cgRef, (snapShot) => {
      // this.arrCG = Object.values(snapShot.val());
      // this.arrCG = snapShot.val();

      if (snapShot.exists()) {
        this.arrCG = Object.entries(snapShot.val()).map(([id, value]) => ({
          id,
          ...(value as Object),
        }));
      }
    });
  }

  ngOnInit() {
    if (this.user.name) {
      this.name = this.user.name;
    }
  }

  ionViewWillEnter() {
    this.title.setTitle('Edit Assigned CG');
  }

  async edit() {
    const dataRef = ref(
      this.db,
      'new_online_attendance2022/users/' + this.user.id
    );
    update(dataRef, {
      name: this.name,
    }).then(() => {
      this.modalCtrl.dismiss(null, 'cancel');
    });
  }

  close() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  change(e) {
    this.modalCtrl.dismiss(null, 'cancel').catch((e) => console.log(e));
  }

  onclose() {
    this.modalCtrl
      .dismiss({ cg: this.selectCG, user: this.user }, 'confirm')
      .catch((e) => console.log(e));
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
}
