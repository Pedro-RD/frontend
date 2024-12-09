import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackButtonDashboardComponent } from './back-button-dashboard.component';

describe('BackButtonDashboardComponent', () => {
  let component: BackButtonDashboardComponent;
  let fixture: ComponentFixture<BackButtonDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackButtonDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BackButtonDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
