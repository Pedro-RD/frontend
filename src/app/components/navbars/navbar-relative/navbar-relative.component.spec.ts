import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarRelativeComponent } from './navbar-relative.component';

describe('NavbarRelativeComponent', () => {
  let component: NavbarRelativeComponent;
  let fixture: ComponentFixture<NavbarRelativeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarRelativeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarRelativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
