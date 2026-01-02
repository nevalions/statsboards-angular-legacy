import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { TuiLink, RouterLink, RouterLinkActive } from '@angular/router';
import { TuiLink as TaigaLink } from '@taiga-ui/core';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent, TaigaLink, RouterLink, RouterLinkActive],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have title property', () => {
    expect(component.title).toBeDefined();
    component.title = 'Test Title';
    expect(component.title).toBe('Test Title');
  });
});
