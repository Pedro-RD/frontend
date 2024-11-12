export interface Entity {
  id: number;
}

export interface TableColumn<T extends Entity> {
  colKey: string;
  imageKey?: string;
  subKey?: string;

  label: string;
  classList?: string[];

  type?: ColumnType;
  dateFormat?: string;
}

export interface TableConfig<T extends Entity> {
  columns: TableColumn<T>[];
}

export enum ColumnType {
  TEXT = "text",
  PROFILE = "profile",
  DATE = "date"

}
