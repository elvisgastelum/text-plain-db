import { ISchemaObject, Types } from "../types/core.ts";

export const Validators: Record<keyof Types, (value: unknown) => boolean> = {
  String: (value: unknown) => {
    if (typeof value !== "string") {
      throw new Error("Expected a string");
    }
    return true;
  },
  Int: (value: unknown) => {
    if (typeof value !== "number") {
      throw new Error("Expected a number");
    }
    return true;
  },
  Float: (value: unknown) => {
    if (typeof value !== "number") {
      throw new Error("Expected a number");
    }
    return true;
  },
  UUID: (value: unknown) => {
    if (typeof value !== "string") {
      throw new Error("Expected a string");
    }
    return true;
  },
  "Time.DateTime": (value: unknown) => {
    if (typeof value !== "string") {
      throw new Error("Expected a string");
    }
    return true;
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
    return validator(data[key]);
  });
};
