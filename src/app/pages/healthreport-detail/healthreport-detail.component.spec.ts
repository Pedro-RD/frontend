import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidentsDetailComponent } from './healthreport-detail.component';

describe('ResidentsDetailComponent', () => {
  let component: ResidentsDetailComponent;
  let fixture: ComponentFixture<ResidentsDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResidentsDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResidentsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
