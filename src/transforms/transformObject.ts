import { FieldSchema } from "../types/FieldSchema";
import ZapierSchemaGenerator from "../ZapierSchemaGenerator";

export function transformObject(
  fieldSchema: Partial<FieldSchema>,
  prop: any,
  generator: ZapierSchemaGenerator
): Partial<FieldSchema> | null {

  let requiredItems:any[] = Array.isArray(prop.required) ? prop.required  : [] 
  
  if(fieldSchema.key) {
    requiredItems = requiredItems.map(i => [fieldSchema.key, i].join("."))
  }

  let children = (Object.entries(prop.properties || {}).map(([key, value]) => {
    let schema = generator.getFieldSchema(value, key, fieldSchema.key)
    if(schema && requiredItems.indexOf(schema.key) !== -1) {
      schema.required = true
    }
    return schema
  }) as unknown) as FieldSchema[];

  return {
    ...fieldSchema,
    children
  };
}
