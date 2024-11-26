import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectBoxMultipleComponent } from './select-box-multiple.component';

describe('SelectBoxMultipleComponent', () => {
  let component: SelectBoxMultipleComponent;
  let fixture: ComponentFixture<SelectBoxMultipleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectBoxMultipleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectBoxMultipleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
