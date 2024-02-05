import { ISchemaObject, Types } from "../types/core.ts";
import { z } from "zod";

export const Validators = {
  String: (value: unknown) => {
    const schema = z.string();

    return schema.safeParse(value).success;
  },
  Int: (value: unknown) => {
    const schema = z.number().int("Should be an integer");

    return schema.safeParse(value).success;
  },
  Float: (value: unknown) => {
    const schema = z.number().refine((n) => {
      return !z.number().int().safeParse(n).success &&
        z.number().finite().safeParse(n).success;
    }, "Should not be an integer");

    return schema.safeParse(value).success;
  },
  UUID: (value: unknown) => {
    const schema = z.string().uuid("Should be a valid UUID");

    return schema.safeParse(value).success;
  },
  "Time.DateTime": (value: unknown) => {
    const schema = z.string().datetime("Should be a valid date");

    return schema.safeParse(value).success;
  },
};

export const validateSchema = <Schema extends ISchemaObject>(
  schema: Record<string, keyof Types>,
  data: unknown,
): data is Schema => {
  return Object.entries(schema).every(([key, value]) => {
    const validator = Validators[value];
    if (!validator) {
      throw new Error("Invalid schema");
    }

    if (typeof data !== "object" || data === null || !(key in data)) {
      throw new Error(`Missing key: ${key}`);
    }
    return validator(data[key as keyof typeof data]);
  });
};
