import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertComponent, AlertType } from './alert.component';

describe('AlertComponent', () => {
  let component: AlertComponent;
  let fixture: ComponentFixture<AlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initial state', () => {
    it('should have default values', () => {
      expect(component.type).toBe('info');
      expect(component.title).toBe('');
      expect(component.message).toBe('');
      expect(component.dismissible).toBeTruthy();
      expect(component.showIcon).toBeTruthy();
      expect(component.autoClose).toBeFalsy();
      expect(component.autoCloseDelay).toBe(5000);
      expect(component.isVisible).toBeTruthy();
    });
  });

  describe('ngOnInit', () => {
    it('should set timeout when autoClose is true', () => {
      spyOn(window, 'setTimeout');
      component.autoClose = true;
      component.autoCloseDelay = 3000;

      component.ngOnInit();

      expect(setTimeout).toHaveBeenCalledWith(jasmine.any(Function), 3000);
    });

    it('should not set timeout when autoClose is false', () => {
      spyOn(window, 'setTimeout');
      component.autoClose = false;

      component.ngOnInit();

      expect(setTimeout).not.toHaveBeenCalled();
    });
  });

  describe('dismiss', () => {
    it('should hide alert and emit dismissed event', () => {
      spyOn(component.dismissed, 'emit');

      component.dismiss();

      expect(component.isVisible).toBeFalsy();
      expect(component.dismissed.emit).toHaveBeenCalled();
    });
  });

  describe('onActionClick', () => {
    it('should emit actionClicked event with action', () => {
      spyOn(component.actionClicked, 'emit');
      const action = 'retry';

      component.onActionClick(action);

      expect(component.actionClicked.emit).toHaveBeenCalledWith(action);
    });
  });

  describe('getIconClass', () => {
    it('should return correct icon class for success', () => {
      component.type = 'success';
      expect(component.getIconClass()).toBe('fas fa-check-circle');
    });

    it('should return correct icon class for error', () => {
      component.type = 'error';
      expect(component.getIconClass()).toBe('fas fa-exclamation-circle');
    });

    it('should return correct icon class for warning', () => {
      component.type = 'warning';
      expect(component.getIconClass()).toBe('fas fa-exclamation-triangle');
    });

    it('should return correct icon class for info', () => {
      component.type = 'info';
      expect(component.getIconClass()).toBe('fas fa-info-circle');
    });

    it('should return default icon class for unknown type', () => {
      component.type = 'unknown' as AlertType;
      expect(component.getIconClass()).toBe('fas fa-bell');
    });
  });

  describe('getAlertClass', () => {
    it('should return correct alert class', () => {
      component.type = 'success';
      expect(component.getAlertClass()).toBe('alert alert-success');
    });

    it('should return correct alert class for error', () => {
      component.type = 'error';
      expect(component.getAlertClass()).toBe('alert alert-error');
    });
  });
});