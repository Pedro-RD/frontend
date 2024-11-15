import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthReportComponent } from './healthreport.component';

describe('HealthReportComponent', () => {
  let component: HealthReportComponent;
  let fixture: ComponentFixture<HealthReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HealthReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HealthReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
