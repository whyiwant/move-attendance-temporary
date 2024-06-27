import { Component, Input, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ModalController } from '@ionic/angular';
import { getDatabase, ref, onValue, set, update } from 'firebase/database';

@Component({
  selector: 'app-edit-pastoral-team',
  templateUrl: './edit-pastoral-team.component.html',
  styleUrls: ['./edit-pastoral-team.component.scss'],
})
export class EditPastoralTeamComponent implements OnInit {
  @Input() user: any;

  db: any;
  cluster: any;
  smallTeam: any;
  cg: any;

  arrCluster: any[] = [];
  arrST: any[] = [];
  arrCG: any[] = [];

  constructor(private title: Title, private modalCtrl: ModalController) {
    this.db = getDatabase();

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
  }

  ngAfterViewInit(): void {}

  ngOnInit() {
    if (this.user.pastoral_team) {
      this.cluster = this.arrCluster[this.user.pastoral_team.cluster];
      this.smallTeam = this.arrST[this.user.pastoral_team.st];
      this.cg = this.arrCG[this.user.pastoral_team.cg];
    }
  }

  ionViewWillEnter() {
    this.title.setTitle('Edit User');
  }

  async edit() {
    const dataRef = ref(
      this.db,
      'new_online_attendance2022/users/' + this.user.id
    );
    update(dataRef, {
      pastoral_team: {
        cluster: this.cluster.id,
        st: this.smallTeam.id,
        cg: this.cg.id,
      },
    }).then(() => {
      this.modalCtrl.dismiss(null, 'cancel');
    });
  }

  close() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
}
