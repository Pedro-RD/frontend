import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidentsPaymentsCreateComponent } from './residents-payments-create.component';

describe('ResidentsPaymentsCreateComponent', () => {
  let component: ResidentsPaymentsCreateComponent;
  let fixture: ComponentFixture<ResidentsPaymentsCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResidentsPaymentsCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResidentsPaymentsCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
