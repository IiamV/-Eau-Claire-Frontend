import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-forms-input',
  imports: [],
  templateUrl: './forms-input.html',
  styleUrl: './forms-input.css'
})
export class FormsInput {
  @Input() id: string = '';
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() value: string = '';
}
