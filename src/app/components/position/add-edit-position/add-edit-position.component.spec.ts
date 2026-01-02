import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, Subject } from 'rxjs';
import { vi } from 'vitest';
import { AddEditPositionComponent } from './add-edit-position.component';
import { IPosition } from '../../../type/position.type';
import { DialogService } from '../../../services/dialog.service';
import { Position } from '../postion';
import { FormControl, FormGroup } from '@angular/forms';

describe('AddEditPositionComponent', () => {
  let component: AddEditPositionComponent;
  let fixture: ComponentFixture<AddEditPositionComponent>;
  let mockDialogService: any;
  let mockPosition: any;
  let dialogSubject: Subject<void>;

  const mockPositionData: IPosition = {
    id: 1,
    title: 'Forward',
    sport_id: 1,
  };

  beforeEach(async () => {
    dialogSubject = new Subject();
    mockDialogService = {
      getDialogEvent: vi.fn().mockReturnValue(dialogSubject.asObservable()),
    };

    mockPosition = {
      createPosition: vi.fn(),
      updatePosition: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [AddEditPositionComponent],
      providers: [
        { provide: DialogService, useValue: mockDialogService },
        { provide: Position, useValue: mockPosition },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddEditPositionComponent);
    component = fixture.componentInstance;
  });

  describe('creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize positionForm', () => {
      expect(component.positionForm).toBeInstanceOf(FormGroup);
      expect(component.positionForm.get('positionTitle')).toBeInstanceOf(
        FormControl,
      );
      expect(component.positionForm.get('id')).toBeInstanceOf(FormControl);
    });

    it('should set default action to add', () => {
      expect(component.action).toBe('add');
    });

    it('should set default dialogId', () => {
      expect(component.dialogId).toBe('addDialog');
    });

    it('should initialize open as false', () => {
      expect(component.open).toBe(false);
    });
  });

  describe('showDialog', () => {
    it('should set open to true', () => {
      component.showDialog(true);
      expect(component.open).toBe(true);
    });

    it('should set open to false', () => {
      component.showDialog(false);
      expect(component.open).toBe(false);
    });
  });

  describe('ngOnChanges', () => {
    it('should update form when action is edit and positionToEdit is set', () => {
      component.action = 'edit';
      component.positionToEdit = mockPositionData;

      component.ngOnChanges({
        positionToEdit: { currentValue: mockPositionData } as any,
      });

      expect(component.positionForm.value.id).toBe(1);
      expect(component.positionForm.value.positionTitle).toBe('Forward');
    });

    it('should not update form when action is not edit', () => {
      component.action = 'add';
      component.positionToEdit = mockPositionData;

      component.ngOnChanges({
        positionToEdit: { currentValue: mockPositionData } as any,
      });

      expect(component.positionForm.value.id).toBeNull();
    });
  });

  describe('onSubmit', () => {
    it('should call createPosition when form is valid and action is add', () => {
      component.action = 'add';
      component.sport_Id = 1;
      component.positionForm.setValue({
        id: null,
        positionTitle: 'Forward',
      });

      component.onSubmit();

      expect(mockPosition.createPosition).toHaveBeenCalledWith({
        id: null,
        title: 'Forward',
        sport_id: 1,
      });
    });

    it('should call updatePosition when form is valid and action is edit', () => {
      component.action = 'edit';
      component.sport_Id = 1;
      component.positionForm.setValue({
        id: 1,
        positionTitle: 'Forward',
      });

      component.onSubmit();

      expect(mockPosition.updatePosition).toHaveBeenCalledWith({
        id: 1,
        title: 'Forward',
        sport_id: 1,
      });
    });

    it('should not call createPosition or updatePosition when form is invalid', () => {
      component.action = 'add';
      component.sport_Id = 1;
      component.positionForm.setValue({
        id: null,
        positionTitle: '',
      });

      component.onSubmit();

      expect(mockPosition.createPosition).not.toHaveBeenCalled();
      expect(mockPosition.updatePosition).not.toHaveBeenCalled();
    });
  });

  describe('form validation', () => {
    it('should have positionTitle required', () => {
      const control = component.positionForm.get('positionTitle');
      control?.setValue('');
      fixture.detectChanges();
      expect(control?.valid).toBe(false);
    });

    it('should be valid when positionTitle has value', () => {
      const control = component.positionForm.get('positionTitle');
      control?.setValue('Forward');
      fixture.detectChanges();
      expect(control?.valid).toBe(true);
    });
  });

  describe('template rendering', () => {
    it('should render component', () => {
      fixture.detectChanges();
      expect(fixture.nativeElement).toBeTruthy();
    });
  });
});
