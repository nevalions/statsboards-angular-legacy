import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { AddEditPositionTableComponent } from './add-edit-position-table.component';
import { Position } from '../postion';
import { DialogService } from '../../../services/dialog.service';
import { IPosition } from '../../../type/position.type';

describe('AddEditPositionTableComponent', () => {
  let component: AddEditPositionTableComponent;
  let fixture: ComponentFixture<AddEditPositionTableComponent>;
  let mockPosition: any;
  let mockDialogService: any;

  beforeEach(async () => {
    mockPosition = {
      createPosition: vi.fn(),
      updatePosition: vi.fn(),
      deletePositionWithId: vi.fn(),
    };

    mockDialogService = {
      showDialog: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [AddEditPositionTableComponent],
      providers: [
        { provide: Position, useValue: mockPosition },
        { provide: DialogService, useValue: mockDialogService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddEditPositionTableComponent);
    component = fixture.componentInstance;
  });

  describe('creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize positionForm', () => {
      expect(component.positionForm).toBeDefined();
    });

    it('should have newPositionsCount', () => {
      expect(component.newPositionsCount).toBe(0);
    });

    it('should have isEnabled property', () => {
      expect(component.isEnabled).toBe(false);
    });

    it('should have editableIndex property', () => {
      expect(component.editableIndex).toBeNull();
    });
  });

  describe('inputs', () => {
    it('should accept sportId input', () => {
      component.sportId = 1;
      expect(component.sportId).toBe(1);
    });

    it('should accept positions input', () => {
      const mockPositions: IPosition[] = [
        { id: 1, title: 'Forward', sport_id: 1 },
        { id: 2, title: 'Midfielder', sport_id: 1 },
      ];
      component.positions = mockPositions;
      expect(component.positions).toBe(mockPositions);
    });
  });

  describe('ngOnChanges', () => {
    it('should initializeForm when positions input changes', () => {
      const mockPositions: IPosition[] = [
        { id: 1, title: 'Forward', sport_id: 1 },
      ];

      const changes = {
        positions: {
          currentValue: mockPositions,
          previousValue: undefined,
          firstChange: false,
        },
      };

      (component as any).ngOnChanges(changes);

      expect(component.positionForm.controls).toBeDefined();
    });
  });

  describe('addNewPosition', () => {
    it('should add new position to positions array', () => {
      component.positions = [{ id: 1, title: 'Forward', sport_id: 1 }];

      component.addNewPosition();

      expect(component.positions.length).toBe(2);
      expect(component.positions[1].id).toBeNull();
    });

    it('should not add new position if last position has id', () => {
      component.positions = [{ id: 1, title: 'Forward', sport_id: 1 }];

      component.addNewPosition();

      expect(component.positions.length).toBe(1);
    });
  });

  describe('isNewPosition', () => {
    it('should return true when new position control exists', () => {
      component.positions = [
        { id: 1, title: 'Forward', sport_id: 1 },
        { id: null, title: '', sport_id: 1 },
      ];
      (component as any).initializeForm();

      const result = (component as any).isNewPosition();

      expect(result).toBe(true);
    });

    it('should return false when new position control does not exist', () => {
      component.positions = [
        { id: 1, title: 'Forward', sport_id: 1 },
        { id: 2, title: 'Midfielder', sport_id: 1 },
      ];
      (component as any).initializeForm();

      const result = (component as any).isNewPosition();

      expect(result).toBe(false);
    });
  });

  describe('getControlNameByIndex', () => {
    it('should return position{id} for existing position', () => {
      component.positions = [{ id: 1, title: 'Forward', sport_id: 1 }];
      const controlName = (component as any).getControlNameByIndex(0);
      expect(controlName).toBe('position1');
    });

    it('should return newPosition{count} for new position', () => {
      component.positions = [
        { id: 1, title: 'Forward', sport_id: 1 },
        { id: null, title: '', sport_id: 1 },
      ];
      const controlName = (component as any).getControlNameByIndex(1);
      expect(controlName).toBe('newPosition1');
    });
  });

  describe('onDeleteButtonClick', () => {
    it('should call dialogService.showDialog', () => {
      component.onDeleteButtonClick('deleteDialog');

      expect(mockDialogService.showDialog).toHaveBeenCalledWith('deleteDialog');
    });
  });

  describe('onCancelButtonClick', () => {
    it('should remove last position if it is new', () => {
      component.positions = [
        { id: 1, title: 'Forward', sport_id: 1 },
        { id: null, title: '', sport_id: 1 },
      ];

      component.onCancelButtonClick();

      expect(component.positions.length).toBe(1);
      expect(component.positions[1]).toBeUndefined();
    });

    it('should not remove last position if it has id', () => {
      component.positions = [
        { id: 1, title: 'Forward', sport_id: 1 },
        { id: 2, title: 'Midfielder', sport_id: 1 },
      ];

      component.onCancelButtonClick();

      expect(component.positions.length).toBe(2);
    });
  });

  describe('onDelete', () => {
    it('should call deletePositionWithId', () => {
      component.onDelete(1);

      expect(mockPosition.deletePositionWithId).toHaveBeenCalledWith(1);
    });
  });

  describe('makeEditable', () => {
    it('should enable control and set editableIndex', () => {
      component.positions = [{ id: 1, title: 'Forward', sport_id: 1 }];
      (component as any).initializeForm();

      component.makeEditable(0);

      expect(component.isEnabled).toBe(true);
      expect(component.editableIndex).toBe(0);
    });
  });

  describe('disableAll', () => {
    it('should disable all controls', () => {
      component.positions = [{ id: 1, title: 'Forward', sport_id: 1 }];
      (component as any).initializeForm();
      component.editableIndex = 0;

      component.disableAll(0);

      expect(component.editableIndex).toBeNull();
    });
  });

  describe('template rendering', () => {
    it('should render component', () => {
      fixture.detectChanges();
      expect(fixture.nativeElement).toBeTruthy();
    });
  });
});
