import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicationTableComponent } from './medication-table.component';

describe('MedicationTableComponent', () => {
  let component: MedicationTableComponent;
  let fixture: ComponentFixture<MedicationTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicationTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicationTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
