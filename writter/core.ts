import { TableParser } from "../parser/core.ts";
import { ISchemaObject, IValidator, IWritter, Types } from "../types/core.ts";

export class Writter<Schema extends ISchemaObject> implements IWritter<Schema> {
  protected schema: Record<string, keyof Types>;
  protected parser = new TableParser<Schema>();

  constructor(
    private path: string,
    protected validator: IValidator<Schema>,
  ) {
    this.schema = validator.schema;
  }

  public async write(data: Schema) {
    const { schema, validator } = this;
    let savedRecord: Schema | null = null;

    const table = this.parser.parse(await Deno.readTextFile(this.path));

    if (table.records.some((record) => record.Id === data.Id)) {
      table.records = table.records.map((record) => {
        if (record.Id === data.Id) {
          const savedRecord = { ...record, ...data };
          return savedRecord;
        }
        return record;
      });
    } else {
      savedRecord = data;
      table.records.push(data);
    }

    // Validate the schema
    Object.entries(table.schema).some(([key, value]) => {
      if (schema[key] !== value) {
        console.log(schema[key], value);
        throw new Error("Schema does not match");
      }
    });

    if (!validator.validate(data)) {
      throw new Error("Invalid data");
    }

    const records = table.records
      .map((record) => {
        return Object.entries(record)
          .map(([key, value]) => `${key}\t${value}`)
          .join("\n");
      })
      .join("\n\n");

    const schemaString = Object.entries(schema)
      .map(([key, value]) => `${key}\t${value}`)
      .join("\n");

    await Deno.writeTextFile(this.path, `${schemaString}\n\n${records}`);

    return savedRecord;
  }
}
