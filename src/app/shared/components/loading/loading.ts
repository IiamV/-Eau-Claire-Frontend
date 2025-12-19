import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.html',
  styleUrls: ['./loading.css'],
})
export class LoadingComponent {
  @Input() message: string = 'Đang tải';
  @Input() isShow: boolean = false;
}
