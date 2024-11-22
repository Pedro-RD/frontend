import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormMedicationComponent } from './form-medication.component';

describe('FormMedicationComponent', () => {
  let component: FormMedicationComponent;
  let fixture: ComponentFixture<FormMedicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormMedicationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormMedicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
