import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthReportEditComponent } from './healthreport-edit.component';

describe('HealthReportEditComponent', () => {
  let component: HealthReportEditComponent;
  let fixture: ComponentFixture<HealthReportEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HealthReportEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HealthReportEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
