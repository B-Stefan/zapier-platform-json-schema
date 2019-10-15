import { FieldSchema } from "../types/FieldSchema";
import ZapierSchemaGenerator from "../ZapierSchemaGenerator";
import * as _ from "lodash";
export function transformAllOf(
  fieldSchema: Partial<FieldSchema>,
  prop: any,
  generator: ZapierSchemaGenerator
): Partial<FieldSchema> | null {
  // Find first non string or string with format type and use this

  const key = prop.key ? prop.key : fieldSchema.key;
  const schemas = prop.allOf
    .map((allOfElement: any) => generator.getFieldSchema(allOfElement, key))
    .filter((schema: any) => schema != null);
  if (schemas.length === 0) {
    return null;
  }
  return schemas.reduce((acc: any, current: any) => {
    acc.children.push(...current.children);
    return acc;
  }, schemas.pop());
}
