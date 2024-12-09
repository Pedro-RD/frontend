import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicationAdministrationComponent } from './medication-administration.component';

describe('MedicationAdministrationComponent', () => {
  let component: MedicationAdministrationComponent;
  let fixture: ComponentFixture<MedicationAdministrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicationAdministrationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicationAdministrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
