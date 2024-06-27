import { Component, Input, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ModalController } from '@ionic/angular';
import { getDatabase, ref, update } from 'firebase/database';

@Component({
  selector: 'app-edit-name',
  templateUrl: './edit-name.component.html',
  styleUrls: ['./edit-name.component.scss'],
})
export class EditNameComponent implements OnInit {
  @Input() user: any;

  db: any;
  name!: string;

  constructor(private title: Title, private modalCtrl: ModalController) {
    this.db = getDatabase();
  }

  ngOnInit() {
    if (this.user.name) {
      this.name = this.user.name;
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
      name: this.name,
    }).then(() => {
      this.modalCtrl.dismiss(null, 'cancel');
    });
  }

  close() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
}
