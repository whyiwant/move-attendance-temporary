import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { STRING_CONSTANT } from 'src/helper';

@Component({
  selector: 'app-table-header',
  templateUrl: './table-header.component.html',
  styleUrls: ['./table-header.component.scss'],
})
export class TableHeaderComponent implements OnInit {
  @Input()
  headerTitle!: string;

  @Output('sort') sort: EventEmitter<any> = new EventEmitter();

  clickCnt = 0; // 0 - not sorting, 1 - asc, 2 - desc
  isSort = false;
  isAsc = true;

  constructor() {}

  ngOnInit() {}

  sortFunc() {
    this.clickCnt++;
    if (this.clickCnt % 3 == 0) {
    } else if (this.clickCnt % 3 == 1) {
    } else if (this.clickCnt % 3 == 2) {
    }
    this.isAsc = !this.isAsc;
    this.sort.emit({
      order: this.isAsc
        ? STRING_CONSTANT.ORDER_ASC
        : STRING_CONSTANT.ORDER_DESC,
    });
  }
}
