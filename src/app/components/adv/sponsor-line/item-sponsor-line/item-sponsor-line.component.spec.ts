import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemSponsorLineComponent } from './item-sponsor-line.component';
import { SponsorLine } from '../sponsorLine';
import { AsyncPipe, UpperCasePipe } from '@angular/common';
import { ImageService } from '../../../../services/image.service';

describe('ItemSponsorLineComponent', () => {
  let component: ItemSponsorLineComponent;
  let fixture: ComponentFixture<ItemSponsorLineComponent>;
  let mockSponsorLine: jasmine.SpyObj<SponsorLine>;
  let mockImageService: jasmine.SpyObj<ImageService>;

  beforeEach(async () => {
    mockSponsorLine = jasmine.createSpyObj(
      'SponsorLine',
      ['loadCurrentSponsorLine'],
      {
        sponsorLineWithFullData$: jasmine.createSpyObj('Observable', [
          'subscribe',
        ]),
      },
    );
    mockImageService = jasmine.createSpyObj('ImageService', ['handleError']);

    await TestBed.configureTestingModule({
      imports: [ItemSponsorLineComponent, AsyncPipe, UpperCasePipe],
      providers: [
        { provide: SponsorLine, useValue: mockSponsorLine },
        { provide: ImageService, useValue: mockImageService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemSponsorLineComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have sponsorLine$ observable', () => {
    expect(component.sponsorLine$).toBeDefined();
  });

  it('should have onImgError method', () => {
    expect(component['onImgError']).toBeDefined();
    const mockEvent = new Event('error');
    component['onImgError'](mockEvent);
    expect(mockImageService.handleError).toHaveBeenCalledWith(mockEvent);
  });

  it('should load current sponsor line on construction', () => {
    expect(mockSponsorLine.loadCurrentSponsorLine).toHaveBeenCalled();
  });

  it('should have url helper', () => {
    expect(component['url']).toBeDefined();
  });
});
