import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SponsorSponsorLineConnectionComponent } from './sponsor-sponsor-line-connection.component';

describe('SponsorSponsorLineConnectionComponent', () => {
  let component: SponsorSponsorLineConnectionComponent;
  let fixture: ComponentFixture<SponsorSponsorLineConnectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SponsorSponsorLineConnectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SponsorSponsorLineConnectionComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
