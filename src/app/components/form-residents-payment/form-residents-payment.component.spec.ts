import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormResidentsPaymentComponent } from './form-residents-payment.component';

describe('FormResidentsPaymentComponent', () => {
  let component: FormResidentsPaymentComponent;
  let fixture: ComponentFixture<FormResidentsPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormResidentsPaymentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormResidentsPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
