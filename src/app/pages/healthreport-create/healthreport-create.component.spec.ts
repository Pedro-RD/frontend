import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthReportCreateComponent } from './healthreport-create.component';

describe('ResidentsCreateComponent', () => {
  let component: HealthReportCreateComponent;
  let fixture: ComponentFixture<HealthReportCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HealthReportCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HealthReportCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
