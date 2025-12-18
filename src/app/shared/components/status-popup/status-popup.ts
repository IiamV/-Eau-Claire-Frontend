import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-status-popup',
  templateUrl: './status-popup.html',
  styleUrls: ['./status-popup.css'],
  imports: [RouterLink]
})
export class StatusPopupComponent {
  @Input() isOpen: boolean = false;
  @Input() isSuccess: boolean = false;
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() buttonText: string = '';
  @Input() buttonLink?: string;

  @Output() closePopup = new EventEmitter<void>();
  @Output() buttonClick = new EventEmitter<void>();

  constructor(
    readonly router: Router
  ) { }

  onClose(): void {
    document.body.style.cursor = 'default';
    this.closePopup.emit();
  }

  onButtonClick(): void {
    this.buttonClick.emit();
  }

  get iconColor(): string {
    return this.isSuccess ? '#00D13A' : '#EF4444';
  }

  get buttonColor(): string {
    return this.isSuccess ? 'bg-blue-400 hover:bg-blue-500' : 'bg-red-500 hover:bg-red-600';
  }
}