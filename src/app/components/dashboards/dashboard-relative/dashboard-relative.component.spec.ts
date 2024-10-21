import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardRelativeComponent } from './dashboard-relative.component';

describe('DashboardRelativeComponent', () => {
  let component: DashboardRelativeComponent;
  let fixture: ComponentFixture<DashboardRelativeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardRelativeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardRelativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
