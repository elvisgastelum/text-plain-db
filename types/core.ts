/**
 * The record interface
 * @property Id - The record id
 * @example
 * ```ts
 * const record: IRecord = {
 *   Id: "123",
 * };
 *  ```
 *  */
export interface IRecord {
  Id: string;
}

export type ISchemaObject = object & IRecord;

export interface ITable<Schema extends ISchemaObject> {
  schema: Record<string, string>;
  records: Schema[];
}

export interface ITableParser<Schema extends ISchemaObject> {
  parse: (data: string) => ITable<Schema>;
}

export interface IValidator<Schema extends ISchemaObject> {
  schema: Record<string, keyof Types>;
  validate: (value: unknown) => value is Schema;
}

export interface IWritter<Schema extends ISchemaObject> {
  write: (data: Schema) => Promise<void>;
}

export interface IReader<Schema extends ISchemaObject> {
  getRecords(): Promise<Schema[]>;
  getRecord(id: string): Promise<Schema | null>;
  getRecordsBy(filter: Partial<Schema>): Promise<Schema[]>;
}

export const Types = {
  String: "String",
  Int: "Int",
  Float: "Float",
  UUID: "UUID",
  "Time.DateTime": "Time.DateTime",
} as const;

export type Types = typeof Types;
