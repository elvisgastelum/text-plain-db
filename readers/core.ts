import { TableParser } from "../parser/core.ts";
import { IReader, ISchemaObject } from "../types/core.ts";

export class Reader<Schema extends ISchemaObject> implements IReader<Schema> {
  parser = new TableParser<Schema>();
  constructor(private path: string) {}

  public async getRecords() {
    const data: string = await Deno.readTextFile(this.path);

    return this.parser.parse(data).records;
  }

  public async getRecord(id: string) {
    const data: string = await Deno.readTextFile(this.path);

    return (
      this.parser.parse(data).records.find((record) => record.Id === id) || null
    );
  }

  public async getRecordsBy(filter: Partial<Schema>) {
    const data: string = await Deno.readTextFile(this.path);
    const table = this.parser.parse(data);

    const records = table.records.filter((record) => {
      return Object.entries(filter).every(([key, value]) => {
        return record[key as keyof Schema] === value;
      });
    });

    return records;
  }
}
