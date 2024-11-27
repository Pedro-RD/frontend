import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidentsPaymentsEditComponent } from './residents-payments-edit.component';

describe('ResidentsPaymentsEditComponent', () => {
  let component: ResidentsPaymentsEditComponent;
  let fixture: ComponentFixture<ResidentsPaymentsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResidentsPaymentsEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResidentsPaymentsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
