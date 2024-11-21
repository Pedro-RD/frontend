import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidentsAppointmentsEditComponent } from './residents-appointments-edit.component';

describe('ResidentsAppointmentsEditComponent', () => {
  let component: ResidentsAppointmentsEditComponent;
  let fixture: ComponentFixture<ResidentsAppointmentsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResidentsAppointmentsEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResidentsAppointmentsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
