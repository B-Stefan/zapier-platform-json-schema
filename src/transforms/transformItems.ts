import { FieldSchema } from "../types/FieldSchema";
import ZapierSchemaGenerator from "../ZapierSchemaGenerator";

export function transformItems(
  fieldSchema: Partial<FieldSchema>,
  prop: any,
  generator: ZapierSchemaGenerator
): Partial<FieldSchema> | null {
  const itemsType = prop.items;
  if (!fieldSchema.key) {
    throw new Error(`Key must be set! ${JSON.stringify(fieldSchema)}`);
  }
  const listType = generator.getFieldSchema(itemsType, fieldSchema.key);

  if (listType) {
    return { ...listType, list: true };
  }
  return null;
}
