import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemSponsorComponent } from './item-sponsor.component';
import { Sponsor } from '../sponsor';
import { AsyncPipe, UpperCasePipe } from '@angular/common';
import { ImageService } from '../../../../services/image.service';

describe('ItemSponsorComponent', () => {
  let component: ItemSponsorComponent;
  let fixture: ComponentFixture<ItemSponsorComponent>;
  let mockSponsor: jasmine.SpyObj<Sponsor>;
  let mockImageService: jasmine.SpyObj<ImageService>;

  beforeEach(async () => {
    mockSponsor = jasmine.createSpyObj(
      'Sponsor',
      ['loadCurrentSponsorByUrlId'],
      {
        currentSponsor$: jasmine.createSpyObj('Observable', ['subscribe']),
      },
    );
    mockImageService = jasmine.createSpyObj('ImageService', ['handleError']);

    await TestBed.configureTestingModule({
      imports: [ItemSponsorComponent, AsyncPipe, UpperCasePipe],
      providers: [
        { provide: Sponsor, useValue: mockSponsor },
        { provide: ImageService, useValue: mockImageService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemSponsorComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have sponsor$ observable', () => {
    expect(component.sponsor$).toBeDefined();
  });

  it('should have onImgError method', () => {
    expect(component['onImgError']).toBeDefined();
    const mockEvent = new Event('error');
    component['onImgError'](mockEvent);
    expect(mockImageService.handleError).toHaveBeenCalledWith(mockEvent);
  });

  it('should load current sponsor on construction', () => {
    expect(mockSponsor.loadCurrentSponsorByUrlId).toHaveBeenCalled();
  });

  it('should have url helper', () => {
    expect(component['url']).toBeDefined();
  });
});
