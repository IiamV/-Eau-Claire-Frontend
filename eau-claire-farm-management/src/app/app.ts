import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SharedModule } from './shared/shared.module';

@Component({
  selector: 'app-root',
  imports: [SharedModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('eau-claire-farm-management');
}
