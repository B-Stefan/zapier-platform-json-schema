import { FieldSchema } from "../types/FieldSchema";
import ZapierSchemaGenerator from "../ZapierSchemaGenerator";

export function transformAnyOf(
  fieldSchema: Partial<FieldSchema>,
  prop: any,
  generator: ZapierSchemaGenerator
): Partial<FieldSchema> | null {
  // Find first non string or string with format type and use this
  const nonStringProp = prop.anyOf.filter(
    (anyOfProp: any) => anyOfProp.format || anyOfProp.type !== "string"
  );
  if (nonStringProp.length > 1) {
    return null;
  }
  return generator.getFieldSchema(nonStringProp.pop(), prop.key);
}
