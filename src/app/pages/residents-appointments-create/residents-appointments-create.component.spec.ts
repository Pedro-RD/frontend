import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidentsAppointmentsCreateComponent } from './residents-appointments-create.component';

describe('ResidentsAppointmentsCreateComponent', () => {
  let component: ResidentsAppointmentsCreateComponent;
  let fixture: ComponentFixture<ResidentsAppointmentsCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResidentsAppointmentsCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResidentsAppointmentsCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
