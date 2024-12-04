import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicationDetailModalComponent } from './medication-detail-modal.component';

describe('MedicationDetailModalComponent', () => {
  let component: MedicationDetailModalComponent;
  let fixture: ComponentFixture<MedicationDetailModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicationDetailModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicationDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
