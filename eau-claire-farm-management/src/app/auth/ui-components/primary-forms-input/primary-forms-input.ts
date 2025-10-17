import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-primary-forms-input',
  imports: [],
  templateUrl: './primary-forms-input.html',
  styleUrl: './primary-forms-input.css'
})
export class FormsInput {
  @Input() id: string = '';
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() value: string = '';
}
