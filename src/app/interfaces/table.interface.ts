type NestedKeyOf<T> = {
  [K in keyof T & (string | number)]: T[K] extends object
    ? `${K}` | `${K}.${NestedKeyOf<T[K]>}`
    : `${K}`;
}[keyof T & (string | number)];

export interface IdentifiableEntity {
  id: number;
}

export interface TableColumn<T extends IdentifiableEntity> {
  key: NestedKeyOf<T> | string;
  label: string;
  type?: ColumnType;
  clickable?: boolean;
  formatter?: (value: any) => string;
  default?: string
  // subTextKey?: keyof T;
  // imageUrlKey?: keyof T;
  // countryKey?: keyof T;
}

export interface TableConfig<T extends IdentifiableEntity> {
  columns: TableColumn<T>[];
  // showCheckbox?: boolean;
  // showFooter?: boolean;
}

export enum ColumnType {
  TEXT = 'text',
}
