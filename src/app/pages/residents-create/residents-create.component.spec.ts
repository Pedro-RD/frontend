import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidentsCreateComponent } from './residents-create.component';

describe('ResidentsCreateComponent', () => {
  let component: ResidentsCreateComponent;
  let fixture: ComponentFixture<ResidentsCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResidentsCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResidentsCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
