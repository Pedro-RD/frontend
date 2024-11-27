import { TestBed } from '@angular/core/testing';

import { ResidentsPaymentsService } from './residents-payments.service';

describe('ResidentsPaymentsService', () => {
  let service: ResidentsPaymentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResidentsPaymentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
