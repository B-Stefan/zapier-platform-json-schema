import { FieldSchema } from "../types/FieldSchema";
import ZapierSchemaGenerator from "../ZapierSchemaGenerator";
import { Definition } from "typescript-json-schema";

export function transformAnyOf(
  fieldSchema: Partial<FieldSchema>,
  prop: any,
  generator: ZapierSchemaGenerator
): Partial<FieldSchema> | null {
  // Find first non string or string with format type and use this

  const key = prop.key ? prop.key : fieldSchema.key;

  if (!key) {
    throw new Error(`Invalid state needs key ${JSON.stringify(prop)}`);
  }

  let typeToParse = prop.anyOf.filter(
    (item: Definition) => item.type !== null && item.type !== "null"
  );

  if (typeToParse.length > 1) {
    typeToParse = typeToParse.filter(
      (item: Definition) => item.type !== "string" || item.format
    );
  }
  if (typeToParse.length === 0) {
    return null;
  }
  if (typeToParse.length > 1) {
    // tslint:disable-next-line
    console.warn(
      `Skipped prop because of multiple complex types: ${JSON.stringify(prop)}`
    );
    return null;
  }
  return generator.getFieldSchema(
    typeToParse.pop(),
    fieldSchema.key || "unknown"
  );
}
