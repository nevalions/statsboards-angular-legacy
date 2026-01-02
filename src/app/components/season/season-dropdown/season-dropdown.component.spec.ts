import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { SeasonDropdownComponent } from './season-dropdown.component';
import { SeasonService } from '../season.service';
import { ISeason } from '../../../type/season.type';

describe('SeasonDropdownComponent', () => {
  let component: SeasonDropdownComponent;
  let mockSeasonService: any;

  const mockSeasons: ISeason[] = [
    { id: 1, year: 2024, description: '2024 Season' },
    { id: 2, year: 2023, description: '2023 Season' },
  ];

  beforeEach(async () => {
    mockSeasonService = {
      findAll: vi.fn().mockReturnValue(of(mockSeasons)),
    };

    await TestBed.configureTestingModule({
      imports: [SeasonDropdownComponent],
      providers: [{ provide: SeasonService, useValue: mockSeasonService }],
    }).compileComponents();

    const fixture = TestBed.createComponent(SeasonDropdownComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have TUI_ARROW property', () => {
    expect(component.arrow).toBeDefined();
  });

  describe('inherited functionality', () => {
    it('should have dataList$ observable', () => {
      expect(component.dataList$).toBeDefined();
    });

    it('should have mapItemToLabel method', () => {
      expect(component.mapItemToLabel).toBeDefined();
    });

    it('should have seasonRoute method', () => {
      expect(component.seasonRoute).toBeDefined();
    });

    it('should load seasons on init', () => {
      component.ngOnInit();

      expect(mockSeasonService.findAll).toHaveBeenCalled();
    });
  });
});
