import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-input',
  templateUrl: './input.html',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  styleUrl: './input.scss',
})
export class Input {
  label = input<string>('');
  type = input<string>('text');
  placeholder = input<string>('');
  control = input.required<FormControl>();
  errorMessage = input<string>('Invalid input');
}
