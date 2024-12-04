import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicationEditComponent } from './medication-edit.component';

describe('MedicationEditComponent', () => {
  let component: MedicationEditComponent;
  let fixture: ComponentFixture<MedicationEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicationEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicationEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
