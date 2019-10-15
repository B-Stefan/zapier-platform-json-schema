import ZapierSchemaBuilder from "../../src/ZapierSchemaBuilder";
import Registry from "../../src/Registry";
import { FieldSchema, FieldSchemaKey } from "../../src/types/FieldSchema";
// tslint:disable
const schema = require("../json-schema-example.json");
// tslint:enable

describe("Example: Builder options", () => {
  it("get a simple schema", () => {
    const zapierSchema = new ZapierSchemaBuilder(schema).build();

    expect(zapierSchema).toBeInstanceOf(Array);
    expect(zapierSchema.length).toEqual(13);
  });

  it("get a nested schema only ", () => {
    const zapierSchema = new ZapierSchemaBuilder(schema.definitions.NestedRef)
      .setRegistry(Registry.fromDefinition(schema)) // Use to determinate refs from parent schema
      .build();

    expect(zapierSchema).toBeInstanceOf(Array);
    expect(zapierSchema.length).toEqual(3);
  });

  it("get a schema and require some keys", () => {
    const zapierSchema = new ZapierSchemaBuilder(schema)
      .addOverride("stringProp", { [FieldSchemaKey.Required]: true })
      .addOverride("booleanProp", { [FieldSchemaKey.Required]: true })
      .build();

    const requiredFields = zapierSchema.filter(
      (entry: FieldSchema) => entry.required === true
    );
    expect(zapierSchema).toBeInstanceOf(Array);
    expect(requiredFields.length).toEqual(2);
  });
});
