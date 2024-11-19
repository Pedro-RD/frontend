import { TestBed } from '@angular/core/testing';

import { ResidentAppointmentsService } from './resident-appointments.service';

describe('ResidentAppointmentsService', () => {
  let service: ResidentAppointmentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResidentAppointmentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
