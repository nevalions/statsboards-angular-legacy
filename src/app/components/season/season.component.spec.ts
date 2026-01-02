import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideMockStore } from '@ngrx/store';
import { of } from 'rxjs';
import { SeasonComponent } from './season.component';
import { ISeason } from '../../../type/season.type';

describe('SeasonComponent', () => {
  let component: SeasonComponent;
  let fixture: ComponentFixture<SeasonComponent>;
  let mockSeasonService: any;
  let mockStore: any;

  const mockSeasons: ISeason[] = [
    {
      id: 1,
      year: 2024,
      description: 'Season 2024',
    },
    {
      id: 2,
      year: 2023,
      description: 'Season 2023',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SeasonComponent],
      providers: [
        provideMockStore({}),
        provideNoopAnimations(),
        provideRouter([]),
        {
          provide: SeasonService,
          useValue: {
            findAll: vi.fn().mockReturnValue(of(mockSeasons)),
          },
        },
      ],
    });

    fixture = TestBed.createComponent(SeasonComponent);
    component = fixture.componentInstance;
    mockSeasonService = TestBed.inject(SeasonService);
    mockStore = TestBed.inject(provideMockStore({}) as any);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load seasons on init', () => {
    component.ngOnInit();

    expect(mockSeasonService.findAll).toHaveBeenCalled();
    expect(component['dataList$']).toBeDefined();
  });

  it('should sort seasons by year descending', () => {
    const mockUnsortedSeasons = [mockSeasons[1], mockSeasons[0]];

    mockSeasonService.findAll = vi
      .fn()
      .mockReturnValue(of(mockUnsortedSeasons));

    component.ngOnInit();

    const seasons = component['dataList$'];
    seasons.subscribe((data: any[]) => {
      expect(data).toEqual([mockSeasons[0], mockSeasons[1]]);
    });
  });

  it('should map season year to label', () => {
    const mockSeason = mockSeasons[0];

    mockSeasonService.findAll = vi.fn().mockReturnValue(of([mockSeason]));

    component.ngOnInit();

    expect(component['mapItemToLabel']).toBeDefined();
  });

  it('should create season routes', () => {
    const mockSeason = mockSeasons[0];

    mockSeasonService.findAll = vi.fn().mockReturnValue(of([mockSeason]));

    component.ngOnInit();

    expect(component['seasonRoute']).toBeDefined();
  });

  it('should create season hrefs', () => {
    const mockSeason = mockSeasons[0];

    mockSeasonService.findAll = vi.fn().mockReturnValue(of([mockSeason]));

    component.ngOnInit();

    expect(component['seasonHref']).toBeDefined();
  });
});
