import { Component, input } from '@angular/core';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [],
  templateUrl: './loading.html',
  styleUrls: ['./loading.css']
})
export class LoadingComponent {
  message = input<string>('Đang tải...');
  show = input<boolean>(false);
}