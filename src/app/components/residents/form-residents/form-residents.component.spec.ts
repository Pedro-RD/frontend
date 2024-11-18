import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormResidentsComponent } from './form-residents.component';

describe('FormResidentsComponent', () => {
  let component: FormResidentsComponent;
  let fixture: ComponentFixture<FormResidentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormResidentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormResidentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
