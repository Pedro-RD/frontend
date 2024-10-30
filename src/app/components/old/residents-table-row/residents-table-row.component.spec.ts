import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidentsTableRowComponent } from './residents-table-row.component';

describe('ResidentsTableRowComponent', () => {
  let component: ResidentsTableRowComponent;
  let fixture: ComponentFixture<ResidentsTableRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResidentsTableRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResidentsTableRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
