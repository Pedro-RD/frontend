export interface TableColumn<T> {
  colKey: string;
  imageKey?: string;
  subKey?: string;

  label: string;
  classList?: string[];

  type?: ColumnType;
}

export interface TableConfig<T> {
  columns: TableColumn<T>[];
}

export enum ColumnType {
  TEXT = "text",
  PROFILE = "profile"
}
