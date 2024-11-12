import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidentsEditComponent } from './residents-edit.component';

describe('ResidentsEditComponent', () => {
  let component: ResidentsEditComponent;
  let fixture: ComponentFixture<ResidentsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResidentsEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResidentsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
