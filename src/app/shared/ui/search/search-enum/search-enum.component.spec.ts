import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchEnumComponent } from './search-enum.component';

describe('SearchEnumComponent', () => {
  let component: SearchEnumComponent;
  let fixture: ComponentFixture<SearchEnumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchEnumComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SearchEnumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
