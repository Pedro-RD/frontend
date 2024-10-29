import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableCellProfileComponent } from './table-cell-profile.component';

describe('TableCellProfileComponent', () => {
  let component: TableCellProfileComponent;
  let fixture: ComponentFixture<TableCellProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableCellProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableCellProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
