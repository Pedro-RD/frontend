import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidentsPaymentsComponent } from './residents-payments.component';

describe('ResidentsPaymentsComponent', () => {
  let component: ResidentsPaymentsComponent;
  let fixture: ComponentFixture<ResidentsPaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResidentsPaymentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResidentsPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
