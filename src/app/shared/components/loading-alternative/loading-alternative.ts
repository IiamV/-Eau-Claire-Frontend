// splash-animation.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-splash-animation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading-alternative.html',
  styleUrls: ['./loading-alternative.css'],
})
export class SplashAnimationComponent {
  @Input() duration: number = 3000; // Animation duration in ms
  @Input() bgColor: string = 'bg-cyan-400'; // Tailwind background color class
}
