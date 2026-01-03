import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SponsorComponent } from './sponsor.component';
import { Sponsor } from './sponsor';
import { AsyncPipe } from '@angular/common';

describe('SponsorComponent', () => {
  let component: SponsorComponent;
  let fixture: ComponentFixture<SponsorComponent>;
  let mockSponsor: jasmine.SpyObj<Sponsor>;

  beforeEach(async () => {
    mockSponsor = jasmine.createSpyObj('Sponsor', ['loadAllSponsors'], {
      allSponsors$: jasmine.createSpyObj('Observable', ['subscribe']),
    });

    await TestBed.configureTestingModule({
      imports: [SponsorComponent, AsyncPipe],
      providers: [{ provide: Sponsor, useValue: mockSponsor }],
    }).compileComponents();

    fixture = TestBed.createComponent(SponsorComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have sponsors$ observable', () => {
    expect(component.sponsors$).toBeDefined();
  });

  it('should have islandTitleProperty set to title', () => {
    expect(component['islandTitleProperty']).toBe('title');
  });

  it('should have itemHref method', () => {
    expect(component['itemHref']).toBeDefined();
    const mockSponsorItem = { id: 1, title: 'Test Sponsor' } as any;
    const href = component['itemHref'](mockSponsorItem);
    expect(href).toBe('home/adv/sponsor/1');
  });

  it('should load all sponsors on construction', () => {
    expect(mockSponsor.loadAllSponsors).toHaveBeenCalled();
  });
});
