import ZapierSchemaGenerator from "../src/ZapierSchemaGenerator";
import { JSONSchema } from "../src/types/JSONSchema";
import Registry from "../src/Registry";

// tslint:disable-next-line
const schema = require("./Example.schema.json") as JSONSchema;

describe("ZapierSchemaGenerator", () => {
  const generator = new ZapierSchemaGenerator();

  describe("PrimitiveTypes", () => {
    it("supports string type", async () => {
      const key = "stringProp";
      const type = generator.getPrimitiveType(schema.properties![key]);
      expect(type).toEqual({
        type: "string"
      });
    });
    it("supports boolean type", async () => {
      const key = "booleanProp";
      const type = generator.getPrimitiveType(schema.properties![key]);
      expect(type).toEqual({
        type: "boolean"
      });
    });

    it("supports datetime type", async () => {
      const key = "dateProp";
      const type = generator.getPrimitiveType(schema.properties![key]);
      expect(type).toEqual({
        type: "datetime"
      });
    });

    it("supports enum type", async () => {
      const key = "enumProp";
      const type = generator.getPrimitiveType(schema.properties![key]);
      expect(type).toEqual({
        type: "string",
        choices: ["option1"]
      });
    });

    it("supports multiple types (prefer non-string)", async () => {
      const key = "multipleTypeProp";
      const type = generator.getPrimitiveType(schema.properties![key]);
      expect(type).toEqual({
        type: "boolean"
      });
    });
    it(" supports array with enum items", async () => {
      const key = "arrayPropEnum";
      expect(generator.getPrimitiveType(schema.properties![key])).toMatchObject(
        {
          type: "string",
          choices: expect.any(Array),
          list: true
        }
      );
    });

    it(" supports anyOf with prefer non-string type", async () => {
      const key = "anyOfPropDatetime";
      expect(generator.getPrimitiveType(schema.properties![key])).toMatchObject(
        {
          type: "datetime"
        }
      );
    });

    it(" returns null for not supported array type", async () => {
      const key = "arrayProp";
      expect(generator.getPrimitiveType(schema.properties![key])).toBeNull();
    });

    it(" returns null for anyOf type", async () => {
      const key = "anyOfProp";
      expect(generator.getPrimitiveType(schema.properties![key])).toBeNull();
    });
  });

  describe("$ref", () => {
    it("supports $ref enum types", async () => {
      const key = "enumRef";
      const [type] = generator.getNestedRefTypes(
        Registry.fromDefinition(schema),
        schema.properties![key],
        key
      );
      expect(type).toEqual({
        key,
        type: "string",
        choices: ["option1", "option2"]
      });
    });

    it("supports $ref object types", async () => {
      const key = "nestedRef";
      const types = generator.getNestedRefTypes(
        Registry.fromDefinition(schema),
        schema.properties![key],
        key
      );
      expect(types).toBeInstanceOf(Array);
      expect(types.length).toBeGreaterThan(0);
    });
  });

  describe("Options", () => {
    it("excludes fileds when in options declared", async () => {
      const types = generator.getZapierSchema(schema, {
        excludes: ["nestedRef"]
      });
      expect(types.length).toEqual(8);
    });

    it("prefers nested include over general exclude", async () => {
      const types = generator.getZapierSchema(schema, {
        excludes: ["nestedRef"],
        includes: ["nestedRef__stringProp"]
      });
      expect(types.length).toEqual(9);
    });

    it("exclude all other but respected includes", async () => {
      const types = generator.getZapierSchema(schema, {
        excludeAll: true,
        includes: ["nestedRef__stringProp"]
      });
      expect(types.length).toEqual(1);
    });

    it("uses overrides option to innject the properties", async () => {
      const types = generator.getZapierSchema(schema, {
        overrides: new Map([["dateProp", { required: true }]])
      });
      const dateProp = types.find(type => type.key === "dateProp");
      expect(dateProp).toEqual(
        expect.objectContaining({
          required: true
        })
      );
    });

    it("prefers overrides over exiting props", async () => {
      const types = generator.getZapierSchema(schema, {
        overrides: new Map([["dateProp", { description: "My description" }]])
      });
      const dateProp = types.find(type => type.key === "dateProp");
      expect(dateProp).toEqual(
        expect.objectContaining({
          description: "My description"
        })
      );
    });
  });

  it("flatten all nested types", async () => {
    const types = generator.getZapierSchema(schema);
    expect(types.length).toEqual(10);
  });

  it("uses Zapier unsercore keys", async () => {
    const key = "nestedRef";
    const types = generator.getNestedRefTypes(
      Registry.fromDefinition(schema),
      schema.properties![key],
      key
    );
    const keys = types.map((prop: any) => prop.key);
    const startWithDoubleUnderscore = keys.filter(
      (keyInList: string) => !keyInList.startsWith(key + "__")
    );
    expect(startWithDoubleUnderscore.length).toEqual(0);
  });
});
