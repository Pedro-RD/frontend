import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarCaretakerComponent } from './navbar-caretaker.component';

describe('NavbarCaretakerComponent', () => {
  let component: NavbarCaretakerComponent;
  let fixture: ComponentFixture<NavbarCaretakerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarCaretakerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarCaretakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
