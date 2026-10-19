import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-button',
  templateUrl: './button.html',
  imports: [MatButtonModule],
  styleUrl: './button.scss',
})
export class Button {
  variant = input<'primary' | 'secondary' | 'ghost'>('primary');
  typeBtn = input<'button' | 'submit' | 'reset'>('button');
  disabled = input<boolean>(false);
}
