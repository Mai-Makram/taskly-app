import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Input } from './input';

describe('Input', () => {
  let fixture: ComponentFixture<Input>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Input] }).compileComponents();
    fixture = TestBed.createComponent(Input);
  });

  it('renders a text input with its placeholder', () => {
    fixture.componentRef.setInput('placeholder', 'Task name');
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input');
    expect(input.type).toBe('text');
    expect(input.placeholder).toBe('Task name');
  });

  it('updates its model when the user types', () => {
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input');
    input.value = 'Plan sprint';
    input.dispatchEvent(new Event('input'));

    expect(fixture.componentInstance.value()).toBe('Plan sprint');
  });
});
