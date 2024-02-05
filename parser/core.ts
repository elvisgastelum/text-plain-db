import { ISchemaObject, ITable, ITableParser, Types } from "../types/core.ts";

export class TableParser<Schema extends ISchemaObject>
  implements ITableParser<Schema>
{
  parse(data: string): ITable<Schema> {
    const lines = data.split("\n\n");
    const definition = lines[0].split("\n");
    const values = lines.slice(1);

    const schema = definition.reduce((acc: Record<string, string>, curr) => {
      const [key, value] = curr.split("\t");
      acc[key] = value;
      return acc;
    }, {});

    const records = values.map((record) => {
      return record.split("\n").reduce<Schema>((acc: Schema, curr) => {
        if (curr === "") return acc;

        const [key, value] = curr.split("\t");
        const type: keyof Types | null = Object.keys(Types).includes(
          schema[key],
        )
          ? (schema[key] as keyof Types)
          : null;

        if (type === null) {
          throw new Error("Invalid schema");
        }

        switch (type) {
          case "String":
            acc[key as keyof Schema] = value as unknown as Schema[keyof Schema];
            break;
          case "Int":
            acc[key as keyof Schema] = parseInt(
              value,
              10,
            ) as unknown as Schema[keyof Schema];
            break;
          case "Float":
            acc[key as keyof Schema] = parseFloat(
              value,
            ) as unknown as Schema[keyof Schema];
            break;
          case "UUID":
            acc[key as keyof Schema] = value as unknown as Schema[keyof Schema];
            break;
          case "Time.DateTime":
            acc[key as keyof Schema] = value as unknown as Schema[keyof Schema];
            break;
        }

        return acc;
      }, {} as Schema);
    });

    return {
      schema,
      records,
    };
  }
}
