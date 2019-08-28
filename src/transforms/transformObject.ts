import { FieldSchema } from "../types/FieldSchema";
import ZapierSchemaGenerator from "../ZapierSchemaGenerator";

export function transformObject(
  fieldSchema: Partial<FieldSchema>,
  prop: any,
  generator: ZapierSchemaGenerator
): Partial<FieldSchema> | null {
  const children = (Object.entries(prop.properties).map(([key, value]) =>
    generator.getFieldSchema(value, key, fieldSchema.key)
  ) as unknown) as FieldSchema[];
  return {
    ...fieldSchema,
    children
  };
}
