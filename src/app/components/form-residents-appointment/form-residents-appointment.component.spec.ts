import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormResidentsAppointmentComponent } from './form-residents-appointment.component';

describe('FormResidentsAppointmentComponent', () => {
  let component: FormResidentsAppointmentComponent;
  let fixture: ComponentFixture<FormResidentsAppointmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormResidentsAppointmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormResidentsAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
