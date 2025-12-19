import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
})
export class Button {
  @Input() buttonText: string = '';
  @Input() buttonType: string = 'submit';
  @Input() extraClass: string = '';
}
