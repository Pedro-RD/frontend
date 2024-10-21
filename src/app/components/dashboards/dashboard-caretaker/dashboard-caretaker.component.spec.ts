import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCaretakerComponent } from './dashboard-caretaker.component';

describe('DashboardCaretakerComponent', () => {
  let component: DashboardCaretakerComponent;
  let fixture: ComponentFixture<DashboardCaretakerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardCaretakerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardCaretakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
