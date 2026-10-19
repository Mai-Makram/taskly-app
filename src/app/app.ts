import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ReactiveFormsModule } from '@angular/forms';
// import { Input } from './shared/components/input/input';

@Component({
  imports: [RouterOutlet, ReactiveFormsModule],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('Taskly-App');
  // emailControl = new FormControl('', [Validators.required, Validators.email]);
}
