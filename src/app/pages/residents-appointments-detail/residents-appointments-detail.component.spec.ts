import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidentsAppointmentsDetailComponent } from './residents-appointments-detail.component';

describe('ResidentsAppointmentsDetailComponent', () => {
  let component: ResidentsAppointmentsDetailComponent;
  let fixture: ComponentFixture<ResidentsAppointmentsDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResidentsAppointmentsDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResidentsAppointmentsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
