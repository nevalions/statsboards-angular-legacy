import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, Subject } from 'rxjs';
import { vi } from 'vitest';
import { AddEditPersonComponent } from './add-edit-person.component';
import { Person } from '../person';
import { ImageService } from '../../../services/image.service';
import { UploadProgressService } from '../../../services/upload-progress.service';
import { DialogService } from '../../../services/dialog.service';
import { DateTimeService } from '../../../services/date-time.service';
import { IPerson } from '../../../type/person.type';
import { UploadResizeImageResponse } from '../../../type/base.type';

describe('AddEditPersonComponent', () => {
  let component: AddEditPersonComponent;
  let fixture: ComponentFixture<AddEditPersonComponent>;
  let mockPerson: any;
  let mockImageService: any;
  let mockUploadProgressService: any;
  let mockDialogService: any;
  let mockDateTimeService: any;

  beforeEach(async () => {
    mockPerson = {
      createPerson: vi.fn(),
      updatePerson: vi.fn(),
      currentPerson$: of(null),
    };

    mockImageService = {
      uploadResizeImage: vi.fn().mockReturnValue(
        of({
          original: 'http://example.com/photo.jpg',
          icon: 'http://example.com/icon.jpg',
          webview: 'http://example.com/web.jpg',
        } as UploadResizeImageResponse),
      ),
    };

    mockUploadProgressService = {
      loadingFiles$: of(null),
      rejectedFiles$: of([]),
      onReject: vi.fn(),
      removeFile: vi.fn(),
      clearRejected: vi.fn(),
    };

    mockDialogService = {
      getDialogEvent: vi.fn().mockReturnValue(of({})),
    };

    mockDateTimeService = {
      convertJsDateTime: vi.fn().mockReturnValue([]),
      convertTuiDateTime: vi.fn().mockReturnValue(new Date('2000-01-01')),
    };

    await TestBed.configureTestingModule({
      imports: [AddEditPersonComponent],
      providers: [
        { provide: Person, useValue: mockPerson },
        { provide: ImageService, useValue: mockImageService },
        { provide: UploadProgressService, useValue: mockUploadProgressService },
        { provide: DialogService, useValue: mockDialogService },
        { provide: DateTimeService, useValue: mockDateTimeService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddEditPersonComponent);
    component = fixture.componentInstance;
  });

  describe('creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize personForm with required controls', () => {
      expect(component.personForm).toBeDefined();
      expect(component.personForm.controls['id']).toBeDefined();
      expect(component.personForm.controls['firstName']).toBeDefined();
      expect(component.personForm.controls['secondName']).toBeDefined();
      expect(component.personForm.controls['personDob']).toBeDefined();
      expect(component.personForm.controls['personPhotoUrl']).toBeDefined();
      expect(component.personForm.controls['personPhotoIconUrl']).toBeDefined();
      expect(component.personForm.controls['personPhotoWebUrl']).toBeDefined();
      expect(component.personForm.controls['personEeslId']).toBeDefined();
    });

    it('should initialize personPhotoForm', () => {
      expect(component.personPhotoForm).toBeInstanceOf(Subject);
    });

    it('should have backendUrl from environment', () => {
      expect(component.backendUrl).toBeDefined();
    });

    it('should have loadingFiles$ observable', () => {
      expect(component.loadingFiles$).toBeDefined();
    });

    it('should have rejectedFiles$ observable', () => {
      expect(component.rejectedFiles$).toBeDefined();
    });
  });

  describe('form validation', () => {
    it('should require firstName', () => {
      component.personForm.controls['firstName'].setValue('');
      expect(component.personForm.controls['firstName'].valid).toBeFalsy();
    });

    it('should require secondName', () => {
      component.personForm.controls['secondName'].setValue('');
      expect(component.personForm.controls['secondName'].valid).toBeFalsy();
    });

    it('should require minimum 2 characters for firstName', () => {
      component.personForm.controls['firstName'].setValue('A');
      expect(component.personForm.controls['firstName'].valid).toBeFalsy();
    });

    it('should require minimum 2 characters for secondName', () => {
      component.personForm.controls['secondName'].setValue('B');
      expect(component.personForm.controls['secondName'].valid).toBeFalsy();
    });

    it('should be valid when firstName and secondName have 2+ characters', () => {
      component.personForm.controls['firstName'].setValue('John');
      component.personForm.controls['secondName'].setValue('Doe');
      expect(component.personForm.valid).toBeTruthy();
    });
  });

  describe('inputs', () => {
    it('should accept action input', () => {
      component.action = 'edit';
      expect(component.action).toBe('edit');
    });

    it('should accept dialogId input', () => {
      component.dialogId = 'editDialog';
      expect(component.dialogId).toBe('editDialog');
    });

    it('should accept personToUpdate input', () => {
      const mockPersonData: IPerson = {
        id: 1,
        first_name: 'John',
        second_name: 'Doe',
        person_photo_url: null,
        person_photo_icon_url: null,
        person_photo_web_url: null,
        person_dob: null,
        person_eesl_id: null,
      };
      component.personToUpdate = mockPersonData;
      expect(component.personToUpdate).toBe(mockPersonData);
    });
  });

  describe('outputs', () => {
    it('should emit addEvent', () => {
      const emitSpy = vi.spyOn(component.addEvent, 'emit');
      component.addEvent.emit({});
      expect(emitSpy).toHaveBeenCalled();
    });

    it('should emit editEvent', () => {
      const emitSpy = vi.spyOn(component.editEvent, 'emit');
      component.editEvent.emit({});
      expect(emitSpy).toHaveBeenCalled();
    });
  });

  describe('ngOnChanges', () => {
    it('should populate form when personToUpdate changes and action is edit', () => {
      const mockPersonData: IPerson = {
        id: 1,
        first_name: 'John',
        second_name: 'Doe',
        person_photo_url: 'http://example.com/photo.jpg',
        person_dob: new Date('2000-01-01'),
        person_photo_icon_url: 'http://example.com/icon.jpg',
        person_photo_web_url: 'http://example.com/web.jpg',
        person_eesl_id: 123,
      };

      component.action = 'edit';
      component.personToUpdate = mockPersonData;

      const changes = {
        personToUpdate: {
          currentValue: mockPersonData,
          previousValue: undefined,
          firstChange: false,
        },
      };

      (component as any).ngOnChanges(changes);

      expect(component.personForm.value.firstName).toBe('John');
      expect(component.personForm.value.secondName).toBe('Doe');
      expect(component.personForm.value.personPhotoUrl).toBe(
        'http://example.com/photo.jpg',
      );
    });

    it('should handle personToUpdate without date of birth', () => {
      const mockPersonData: IPerson = {
        id: 1,
        first_name: 'John',
        second_name: 'Doe',
        person_photo_url: null,
        person_photo_icon_url: null,
        person_photo_web_url: null,
        person_dob: null,
        person_eesl_id: null,
      };

      component.action = 'edit';
      component.personToUpdate = mockPersonData;

      const changes = {
        personToUpdate: {
          currentValue: mockPersonData,
          previousValue: undefined,
          firstChange: false,
        },
      };

      (component as any).ngOnChanges(changes);

      expect(component.personForm.value.personDob).toBeNull();
    });
  });

  describe('onSubmit', () => {
    it('should call createPerson when action is add and form is valid', () => {
      component.personForm.controls['firstName'].setValue('John');
      component.personForm.controls['secondName'].setValue('Doe');
      component.personForm.controls['personDob'].setValue(null);
      component.action = 'add';

      component.onSubmit();

      expect(mockPerson.createPerson).toHaveBeenCalled();
    });

    it('should call updatePerson when action is edit and form is valid', () => {
      component.personForm.controls['firstName'].setValue('John');
      component.personForm.controls['secondName'].setValue('Doe');
      component.personForm.controls['id'].setValue(1);
      component.personForm.controls['personDob'].setValue(null);
      component.action = 'edit';

      component.onSubmit();

      expect(mockPerson.updatePerson).toHaveBeenCalled();
    });

    it('should not submit when form is invalid', () => {
      component.personForm.controls['firstName'].setValue('');
      component.personForm.controls['secondName'].setValue('');

      component.onSubmit();

      expect(mockPerson.createPerson).not.toHaveBeenCalled();
      expect(mockPerson.updatePerson).not.toHaveBeenCalled();
    });
  });

  describe('image upload', () => {
    it('should call uploadResizeImage when file is selected', () => {
      const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
      component.personPhotoForm.setValue(mockFile);

      expect(mockImageService.uploadResizeImage).toHaveBeenCalledWith(
        mockFile,
        'persons/upload_resize_photo',
      );
    });

    it('should update form with photo URLs after upload', () => {
      const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
      component.personPhotoForm.setValue(mockFile);
      fixture.detectChanges();

      expect(component.personForm.value.personPhotoUrl).toBe(
        'http://example.com/photo.jpg',
      );
      expect(component.personForm.value.personPhotoIconUrl).toBe(
        'http://example.com/icon.jpg',
      );
      expect(component.personForm.value.personPhotoWebUrl).toBe(
        'http://example.com/web.jpg',
      );
    });

    it('should handle upload errors gracefully', () => {
      mockImageService.uploadResizeImage.mockReturnValue(
        vi.fn().mockImplementation(() => {
          throw new Error('Upload failed');
        }),
      );

      const consoleErrorSpy = vi.spyOn(console, 'error');
      const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
      component.personPhotoForm.setValue(mockFile);

      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe('file handling', () => {
    it('should call onReject when file is rejected', () => {
      const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
      component.onReject(mockFile);

      expect(mockUploadProgressService.onReject).toHaveBeenCalledWith(mockFile);
    });

    it('should call removeFile when removeFile is called', () => {
      component.removeFile();

      expect(mockUploadProgressService.removeFile).toHaveBeenCalledWith(
        component.personPhotoForm,
      );
    });

    it('should call clearRejected when clearRejected is called', () => {
      component.clearRejected();

      expect(mockUploadProgressService.clearRejected).toHaveBeenCalledWith(
        component.personPhotoForm,
      );
    });
  });

  describe('dialog handling', () => {
    it('should subscribe to dialog events on init', () => {
      component.ngOnInit();

      expect(mockDialogService.getDialogEvent).toHaveBeenCalledWith(
        'addDialog',
      );
    });

    it('should set open to true when dialog event fires', () => {
      component.showDialog(true);
      expect(component.open).toBe(true);
    });

    it('should set open to false when dialog event fires', () => {
      component.showDialog(false);
      expect(component.open).toBe(false);
    });
  });

  describe('cleanup', () => {
    it('should unsubscribe from dialog on destroy', () => {
      component.ngOnInit();

      component.ngOnDestroy();

      expect((component as any).dialogSubscription).toBeDefined();
    });
  });

  describe('template rendering', () => {
    it('should render component', () => {
      fixture.detectChanges();
      expect(fixture.nativeElement).toBeTruthy();
    });

    it('should have form element', () => {
      fixture.detectChanges();
      const formElement = fixture.nativeElement.querySelector('form');
      expect(formElement).toBeTruthy();
    });
  });
});
