import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingSpinnerComponent } from './loading-spinner.component';

describe('LoadingSpinnerComponent', () => {
  let component: LoadingSpinnerComponent;
  let fixture: ComponentFixture<LoadingSpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingSpinnerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('default values', () => {
    it('should have default size medium', () => {
      expect(component.size).toBe('medium');
    });

    it('should have default color', () => {
      expect(component.color).toBe('#667eea');
    });

    it('should have default empty message', () => {
      expect(component.message).toBe('');
    });

    it('should have default overlay false', () => {
      expect(component.overlay).toBeFalsy();
    });
  });

  describe('input binding', () => {
    it('should accept size input', () => {
      component.size = 'large';
      fixture.detectChanges();
      expect(component.size).toBe('large');
    });

    it('should accept color input', () => {
      component.color = '#ff0000';
      fixture.detectChanges();
      expect(component.color).toBe('#ff0000');
    });

    it('should accept message input', () => {
      component.message = 'Loading...';
      fixture.detectChanges();
      expect(component.message).toBe('Loading...');
    });

    it('should accept overlay input', () => {
      component.overlay = true;
      fixture.detectChanges();
      expect(component.overlay).toBeTruthy();
    });
  });
});