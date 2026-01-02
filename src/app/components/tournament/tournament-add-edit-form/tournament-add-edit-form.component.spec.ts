import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TournamentAddEditFormComponent } from './tournament-add-edit-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TuiHint, TuiDialog, TuiError } from '@taiga-ui/core';
import { TuiFieldErrorPipe, TuiFiles, TuiDataListWrapper } from '@taiga-ui/kit';
import {
  TuiTextareaModule,
  TuiInputModule,
  TuiSelectModule,
} from '@taiga-ui/legacy';
import { AsyncPipe } from '@angular/common';
import { CreateButtonInFormComponent } from '../../../shared/ui/buttons/create-button-in-form/create-button-in-form.component';
import { CancelButtonInFormComponent } from '../../../shared/ui/buttons/cancel-button-in-form/cancel-button-in-form.component';
import { SelectFromListComponent } from '../../../shared/ui/select/select-from-list/select-from-list.component';
import { Tournament } from '../tournament';
import { ImageService } from '../../../services/image.service';
import { UploadProgressService } from '../../../services/upload-progress.service';
import { DialogService } from '../../../services/dialog.service';
import { of, Subject } from 'rxjs';

describe('TournamentAddEditFormComponent', () => {
  let component: TournamentAddEditFormComponent;
  let fixture: ComponentFixture<TournamentAddEditFormComponent>;
  let mockTournament: jasmine.SpyObj<Tournament>;
  let mockImageService: jasmine.SpyObj<ImageService>;
  let mockUploadProgressService: UploadProgressService;
  let mockDialogService: jasmine.SpyObj<DialogService>;

  beforeEach(async () => {
    mockTournament = jasmine.createSpyObj('Tournament', [
      'createTournament',
      'updateTournament',
    ]);
    mockImageService = jasmine.createSpyObj('ImageService', [
      'uploadResizeImage',
    ]);
    mockDialogService = jasmine.createSpyObj('DialogService', [
      'getDialogEvent',
    ]);

    mockDialogService.getDialogEvent.and.returnValue(of());

    const mockUploadProgressServicePartial = {
      onReject: jasmine.createSpy('onReject'),
      removeFile: jasmine.createSpy('removeFile'),
      clearRejected: jasmine.createSpy('clearRejected'),
      rejectedFiles$: new Subject<any>(),
      loadingFiles$: new Subject<any>(),
    };

    await TestBed.configureTestingModule({
      imports: [
        TournamentAddEditFormComponent,
        ReactiveFormsModule,
        TuiHint,
        TuiDialog,
        TuiError,
        TuiTextareaModule,
        TuiInputModule,
        TuiSelectModule,
        AsyncPipe,
        TuiFieldErrorPipe,
        TuiFiles,
        CreateButtonInFormComponent,
        CancelButtonInFormComponent,
        TuiDataListWrapper,
        SelectFromListComponent,
      ],
      providers: [
        { provide: Tournament, useValue: mockTournament },
        { provide: ImageService, useValue: mockImageService },
        {
          provide: UploadProgressService,
          useValue: mockUploadProgressServicePartial,
        },
        { provide: DialogService, useValue: mockDialogService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TournamentAddEditFormComponent);
    component = fixture.componentInstance;
    mockUploadProgressService = TestBed.inject(UploadProgressService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with required validators', () => {
    expect(component.tournamentForm).toBeDefined();
    expect(component.tournamentForm.get('tournamentTitle')).toBeDefined();
    const titleControl = component.tournamentForm.get('tournamentTitle');
    expect(titleControl?.validator).toBeTruthy();
  });

  it('should require tournament title', () => {
    const titleControl = component.tournamentForm.get('tournamentTitle');
    titleControl?.setValue('');
    expect(titleControl?.valid).toBeFalsy();
    expect(titleControl?.hasError('required')).toBeTruthy();
  });

  it('should require minimum 3 characters for tournament title', () => {
    const titleControl = component.tournamentForm.get('tournamentTitle');
    titleControl?.setValue('ab');
    expect(titleControl?.valid).toBeFalsy();
    expect(titleControl?.hasError('minlength')).toBeTruthy();

    titleControl?.setValue('abc');
    expect(titleControl?.valid).toBeTruthy();
  });

  it('should have optional fields without validators', () => {
    expect(component.tournamentForm.get('tournamentDescription')).toBeDefined();
    expect(component.tournamentForm.get('tournamentLogoUrl')).toBeDefined();
    expect(component.tournamentForm.get('tournamentMainSponsor')).toBeDefined();
    expect(component.tournamentForm.get('tournamentSponsorLine')).toBeDefined();
  });

  it('should call onReject when file is rejected', () => {
    const file = { name: 'test.jpg' } as any;
    component.onReject(file);
    expect(mockUploadProgressService.onReject).toHaveBeenCalledWith(file);
  });

  it('should call removeFile when removing file', () => {
    component.removeFile();
    expect(mockUploadProgressService.removeFile).toHaveBeenCalledWith(
      component.tournamentLogoForm,
    );
  });

  it('should call clearRejected when clearing rejected files', () => {
    component.clearRejected();
    expect(mockUploadProgressService.clearRejected).toHaveBeenCalledWith(
      component.tournamentLogoForm,
    );
  });

  it('should open dialog when showDialog is called', () => {
    component.showDialog(false);
    expect(component.open).toBeFalsy();

    component.showDialog(true);
    expect(component.open).toBeTruthy();
  });

  it('should call createTournament on form submit for add action', () => {
    component.action = 'add';
    component.sport_Id = 1;
    component.season_Id = 1;

    component.tournamentForm.setValue({
      id: null,
      tournamentTitle: 'Test Tournament',
      tournamentDescription: 'Test Description',
      tournamentLogoUrl: 'logo.png',
      tournamentLogoIconUrl: 'icon.png',
      tournamentLogoWebUrl: 'web.png',
      tournamentMainSponsor: null,
      tournamentSponsorLine: null,
    });

    component.onSubmit();
    expect(mockTournament.createTournament).toHaveBeenCalled();
  });

  it('should call updateTournament on form submit for edit action', () => {
    component.action = 'edit';
    component.sport_Id = 1;
    component.season_Id = 1;

    component.tournamentForm.setValue({
      id: 1,
      tournamentTitle: 'Updated Tournament',
      tournamentDescription: 'Updated Description',
      tournamentLogoUrl: 'logo.png',
      tournamentLogoIconUrl: 'icon.png',
      tournamentLogoWebUrl: 'web.png',
      tournamentMainSponsor: null,
      tournamentSponsorLine: null,
    });

    component.onSubmit();
    expect(mockTournament.updateTournament).toHaveBeenCalled();
  });

  it('should not submit if form is invalid', () => {
    component.action = 'add';
    component.tournamentForm.setValue({
      id: null,
      tournamentTitle: '',
      tournamentDescription: '',
      tournamentLogoUrl: '',
      tournamentLogoIconUrl: '',
      tournamentLogoWebUrl: '',
      tournamentMainSponsor: null,
      tournamentSponsorLine: null,
    });

    component.onSubmit();
    expect(mockTournament.createTournament).not.toHaveBeenCalled();
  });

  it('should populate form on ngOnChanges with edit action', () => {
    component.action = 'edit';
    component.new_tournament = {
      id: 1,
      title: 'Test Tournament',
      description: 'Test Description',
      main_sponsor_id: 1,
      sponsor_line_id: 1,
    } as any;
    component.allSponsors = [{ id: 1, title: 'Sponsor 1' } as any];
    component.allSponsorLines = [{ id: 1, title: 'Line 1' } as any];

    component.ngOnChanges({
      new_tournament: { currentValue: component.new_tournament },
    } as any);

    expect(component.tournamentForm.get('tournamentTitle')?.value).toBe(
      'Test Tournament',
    );
    expect(component.tournamentForm.get('tournamentDescription')?.value).toBe(
      'Test Description',
    );
  });
});
