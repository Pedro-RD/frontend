import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicationTableRowComponent } from './medication-table-row.component';

describe('MedicationTableRowComponent', () => {
  let component: MedicationTableRowComponent;
  let fixture: ComponentFixture<MedicationTableRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicationTableRowComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MedicationTableRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
