import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeesShiftsComponent } from './employees-shifts.component';

describe('EmployeesShiftsComponent', () => {
  let component: EmployeesShiftsComponent;
  let fixture: ComponentFixture<EmployeesShiftsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeesShiftsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeesShiftsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
