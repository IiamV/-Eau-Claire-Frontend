import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.css'
})
export class Button {
  @Input() buttonText: string = '';
  @Input() buttonType: string = 'submit';
  @Input() extraClass: string = '';
}
