import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableCellTextComponent } from './table-cell-text.component';

describe('TableCellTextComponent', () => {
  let component: TableCellTextComponent;
  let fixture: ComponentFixture<TableCellTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableCellTextComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableCellTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
