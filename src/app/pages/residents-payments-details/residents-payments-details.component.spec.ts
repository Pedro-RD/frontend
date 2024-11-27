import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidentsPaymentsDetailsComponent } from './residents-payments-details.component';

describe('ResidentsPaymentsDetailsComponent', () => {
  let component: ResidentsPaymentsDetailsComponent;
  let fixture: ComponentFixture<ResidentsPaymentsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResidentsPaymentsDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResidentsPaymentsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
