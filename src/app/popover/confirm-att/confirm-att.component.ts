import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { set, ref, Database, getDatabase } from 'firebase/database';

@Component({
  selector: 'app-confirm-att',
  templateUrl: './confirm-att.component.html',
  styleUrls: ['./confirm-att.component.scss'],
})
export class ConfirmAttComponent implements OnInit, AfterViewInit {
  @Input() att;
  isCGAbsWritten = true;
  db: Database;

  constructor(private modalCtrl: ModalController) {
    this.db = getDatabase();
  }

  ngAfterViewInit(): void {
    set(
      ref(
        this.db,
        'new_online_attendance2022/second_backup/' +
          this.att.CG +
          '@' +
          this.att.title
      ),
      this.att
    );
  }

  ngOnInit() {
    for (let num of this.att['attCG']['arr']) {
      if (num.attendance == '0' && num.reason == '') {
        this.isCGAbsWritten = false;
      }
    }
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(null, 'confirm');
  }
}
