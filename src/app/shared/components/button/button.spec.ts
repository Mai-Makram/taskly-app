import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Button } from './button';

describe('Button', () => {
  let fixture: ComponentFixture<Button>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Button] }).compileComponents();
    fixture = TestBed.createComponent(Button);
  });

  it('projects its content into a native button', () => {
    fixture.nativeElement.textContent = 'Save';
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('button').textContent.trim()).toBe('Save');
  });

  it('supports the disabled state', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('button').disabled).toBe(true);
  });
});
