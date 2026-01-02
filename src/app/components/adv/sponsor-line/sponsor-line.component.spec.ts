import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SponsorLineComponent } from './sponsor-line.component';
import { SponsorLine } from './sponsorLine';
import { AsyncPipe } from '@angular/common';

describe('SponsorLineComponent', () => {
  let component: SponsorLineComponent;
  let fixture: ComponentFixture<SponsorLineComponent>;
  let mockSponsorLine: jasmine.SpyObj<SponsorLine>;

  beforeEach(async () => {
    mockSponsorLine = jasmine.createSpyObj(
      'SponsorLine',
      ['loadAllSponsorLines'],
      {
        allSponsorLines$: jasmine.createSpyObj('Observable', ['subscribe']),
      },
    );

    await TestBed.configureTestingModule({
      imports: [SponsorLineComponent, AsyncPipe],
      providers: [{ provide: SponsorLine, useValue: mockSponsorLine }],
    }).compileComponents();

    fixture = TestBed.createComponent(SponsorLineComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have sponsorLines$ observable', () => {
    expect(component.sponsorLines$).toBeDefined();
  });

  it('should have islandTitleProperty set to title', () => {
    expect(component['islandTitleProperty']).toBe('title');
  });

  it('should have itemHref method', () => {
    expect(component['itemHref']).toBeDefined();
    const mockSponsorItem = { id: 1, title: 'Test Sponsor Line' } as any;
    const href = component['itemHref'](mockSponsorItem);
    expect(href).toBe('home/adv/sponsors/line/1');
  });

  it('should load all sponsor lines on construction', () => {
    expect(mockSponsorLine.loadAllSponsorLines).toHaveBeenCalled();
  });
});
