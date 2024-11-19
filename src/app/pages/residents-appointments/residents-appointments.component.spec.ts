import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidentsAppointmentsComponent } from './residents-appointments.component';

describe('ResidentsAppointmentsComponent', () => {
  let component: ResidentsAppointmentsComponent;
  let fixture: ComponentFixture<ResidentsAppointmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResidentsAppointmentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResidentsAppointmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
