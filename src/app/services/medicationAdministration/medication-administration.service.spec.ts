import { TestBed } from '@angular/core/testing';

import { MedicationAdministrationService } from './medication-administration.service';

describe('MedicationAdministrationService', () => {
  let service: MedicationAdministrationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MedicationAdministrationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
