import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  Auth,
  User,
  getAuth,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
import {
  Database,
  getDatabase,
  ref,
  get,
  onValue,
  update,
  push,
  remove,
} from 'firebase/database';
import { ModalController, ToastController } from '@ionic/angular';
import { EditPastoralTeamComponent } from './edit-pastoral-team/edit-pastoral-team.component';
import { Title } from '@angular/platform-browser';
import { EditNameComponent } from './edit-name/edit-name.component';
import { presentToast } from 'src/helper';
import { PERMISSION } from 'src/app/constants';
import { EditAssignedCGComponent } from './edit-assigned-cg/edit-assigned-cg.component';
import { BasePage } from 'src/interface/BasePage';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.page.html',
  styleUrls: ['./user-management.page.scss'],
})
export class UserManagementPage extends BasePage implements OnInit {
  // auth!: Auth;
  // user!: User | null;
  // db!: Database;

  arrUser: any[] = [];
  arrPermission = [
    PERMISSION.SUPER_USER,
    PERMISSION.TL,
    PERMISSION.SCGL,
    PERMISSION.CGL,
    PERMISSION.FL,
    PERMISSION.WM,
    PERMISSION.NOT_VERIFIED,
  ];
  arrCluster: any[] = [];
  arrST: any[] = [];
  arrCG: any[] = [];

  arrAttCG: any[] = [];

  constructor(
    router: Router,
    private modelCtrl: ModalController,
    private title: Title,
    private toastController: ToastController
  ) {
    // this.auth = getAuth();
    // this.db = getDatabase();
    super(router, true);

    // onAuthStateChanged(this.auth, (user) => {
    //   this.user = user;
    //   if (user) {
    //     const userRef = ref(
    //       this.db,
    //       'new_online_attendance2022/users/' + user.uid
    //     );
    //     get(userRef).then((v) => {
    //       if (v.exists()) {
    //         if (v.val()['permission'] == PERMISSION.SUPER_USER) {
    //         } else {
    //           this.router.navigate(['']);
    //         }
    //       }
    //     });
    //   } else {
    //     this.router.navigate(['']);
    //   }
    // });

    const clusterRef = ref(this.db, 'move_follow_up_2023/clusters');
    onValue(clusterRef, (snapShot) => {
      // this.arrCluster = Object.values(snapShot.val());
      this.arrCluster = snapShot.val();
    });

    const stRef = ref(this.db, 'move_follow_up_2023/small_teams');
    onValue(stRef, (snapShot) => {
      // this.arrST = Object.values(snapShot.val());
      this.arrST = snapShot.val();
    });

    const cgRef = ref(this.db, 'move_follow_up_2023/CGs');
    onValue(cgRef, (snapShot) => {
      // this.arrCG = Object.values(snapShot.val());
      this.arrCG = snapShot.val();
    });

    const attCgRef = ref(this.db, 'new_online_attendance2022/CGs');
    onValue(attCgRef, (snapShot) => {
      this.arrAttCG = snapShot.val();
    });
  }

  loadData(): void {
    if (this.user.permission == PERMISSION.SUPER_USER) {
      console.log('Super User.');
    } else {
      this.router.navigate(['']);
    }
  }

  ngOnInit() {
    this.title.setTitle('User Management Console');
    const userRef = ref(this.db, 'new_online_attendance2022/users');
    onValue(userRef, (v) => {
      if (v.exists()) {
        this.arrUser = Object.values(v.val());
      }
    });
  }

  async editPastoralTeam(user: any) {
    const modal = await this.modelCtrl.create({
      component: EditPastoralTeamComponent,
      componentProps: { user }, // this is to pass data to the popover component
      // cssClass: 'loading-modal',
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    modal.dismiss();
    this.title.setTitle('User Management Console');
  }

  async editName(user: any) {
    const modal = await this.modelCtrl.create({
      component: EditNameComponent,
      componentProps: { user }, // this is to pass data to the popover component
      // cssClass: 'loading-modal',
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    modal.dismiss();
    this.title.setTitle('User Management Console');
  }

  async editAssignedCG(user: any) {
    const modal = await this.modelCtrl.create({
      component: EditAssignedCGComponent,
      componentProps: { user }, // this is to pass data to the popover component
      // cssClass: 'loading-modal',
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role == 'confirm') {
      // console.log(data);
      const dataRef = ref(
        this.db,
        'new_online_attendance2022/users/' + data.user.id + '/assigned_cg'
      );
      push(dataRef, data.cg.id).then(() => {
        // presentToast('Permission updated!', this.toastController, 1500);
      });
    }
    modal.dismiss();
    this.title.setTitle('User Management Console');
  }

  delAssignedCG(user: any, cg: any) {
    // console.log(cg);
    const dataRef = ref(
      this.db,
      'new_online_attendance2022/users/' + user.id + '/assigned_cg/' + cg.key
    );
    remove(dataRef)
      .then(() => {
        // presentToast("D")
      })
      .catch((e) => {
        presentToast('Error!', this.toastController, 1000);
        console.log(e);
      });
  }

  changeUserLevel(user: any) {
    const dataRef = ref(this.db, 'new_online_attendance2022/users/' + user.id);
    update(dataRef, {
      permission: user.permission,
    }).then(() => {
      presentToast('Permission updated!', this.toastController, 1500);
    });
  }

  get sortedUsers() {
    let arrST = this.arrST;
    let arrCG = this.arrCG;
    let arr = this.arrUser.sort(function (a: any, b: any) {
      if (a.pastoral_team == null) {
        return 1;
      } else if (b.pastoral_team == null) {
        return -1;
      }
      let v1 = arrST[a.pastoral_team.st].name.localeCompare(
        arrST[b.pastoral_team.st].name
      ); // compare st
      if (v1 == 1) {
        return 1; // if st bigger return bigger
      } else if (v1 == 0) {
        function cgNum(cgName: string): number {
          var num = cgName.match(/\d+/g);
          if (num) {
            return parseInt(num[0]);
          } else {
            return 0;
          }
        }

        let v2 =
          cgNum(arrCG[a.pastoral_team.cg].name) -
          cgNum(arrCG[b.pastoral_team.cg].name); // if st same, compare cg number
        if (v2 > 0) {
          return 1;
        } else if (v2 == 0) {
          // if cg number same, compare cg name (A, B, C...)
          let v3 = (arrCG[a.pastoral_team.cg].name as string).localeCompare(
            arrCG[b.pastoral_team.cg].name
          );
          if (v3 == 0) {
            // if in the same cg, sort by status, then name
            if (a.permission == b.permission) {
              return (a.name as string).localeCompare(b.name);
            } else {
              const order = [
                'Super user',
                'TL',
                'SCGL',
                'CGL',
                'FL',
                'WM',
                'Not verified',
              ]; // Define the desired order

              const statusA = order.indexOf(a.permission);
              const statusB = order.indexOf(b.permission);

              // Compare the indexes of the status values
              // If statusA is lower, it should come before statusB
              // If statusA is higher, it should come after statusB
              return statusA - statusB;
            }
          } else {
            return v3;
          }
        } else {
          return -1;
        }
      } else {
        return -1; // if st smaller return smaller
      }
    });

    return arr;
  }
}
