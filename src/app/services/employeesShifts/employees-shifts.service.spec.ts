import { TestBed } from '@angular/core/testing';

import { EmployeesShiftsService } from './employees-shifts.service';

describe('EmployeesShiftsService', () => {
  let service: EmployeesShiftsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeesShiftsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
