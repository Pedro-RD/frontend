import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeShiftsManagementComponent } from './employee-shifts-management.component';

describe('EmployeeShiftsManagementComponent', () => {
  let component: EmployeeShiftsManagementComponent;
  let fixture: ComponentFixture<EmployeeShiftsManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeShiftsManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeShiftsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
