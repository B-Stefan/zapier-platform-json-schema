import ZapierSchemaGenerator from "../src/ZapierSchemaGenerator";
import { JSONSchema } from "../src/types/JSONSchema";
import Registry from "../src/Registry";
import * as _ from "lodash";

// tslint:disable-next-line
const schema = require("./Example.schema.json") as JSONSchema;

describe("ZapierSchemaGenerator", () => {
  const generator = new ZapierSchemaGenerator();

  describe("PrimitiveTypes", () => {
    it("supports string type", async () => {
      const key = "stringProp";
      const type = generator.getFieldSchema(schema.properties![key], key);
      expect(type).toEqual(
        expect.objectContaining({
          type: "string"
        })
      );
    });
    it("supports boolean type", async () => {
      const key = "booleanProp";
      const type = generator.getFieldSchema(schema.properties![key], key);
      expect(type).toEqual(
        expect.objectContaining({
          type: "boolean"
        })
      );
    });

    it("supports datetime type", async () => {
      const key = "dateProp";
      const type = generator.getFieldSchema(schema.properties![key], key);
      expect(type).toEqual(
        expect.objectContaining({
          type: "datetime"
        })
      );
    });

    it("supports enum type", async () => {
      const key = "enumProp";
      const type = generator.getFieldSchema(schema.properties![key], key);
      expect(type).toEqual(
        expect.objectContaining({
          type: "string",
          choices: ["option1"]
        })
      );
    });

    it("supports multiple types (prefer non-string)", async () => {
      const key = "multipleTypeProp";
      const type = generator.getFieldSchema(schema.properties![key], key);
      expect(type).toEqual(
        expect.objectContaining({
          type: "boolean"
        })
      );
    });
    it("supports multiple types (prefer non-null)", async () => {
      const key = "multipleTypePropWithNull";
      const type = generator.getFieldSchema(schema.properties![key], key);
      expect(type).toEqual(
        expect.objectContaining({
          type: "string"
        })
      );
    });
    it(" supports array with enum items", async () => {
      const key = "arrayPropEnum";
      expect(
        generator.getFieldSchema(schema.properties![key], key)
      ).toMatchObject({
        type: "string",
        choices: expect.any(Array),
        list: true
      });
    });

    it(" supports anyOf with prefer non-string type", async () => {
      const key = "anyOfPropDatetime";
      expect(
        generator.getFieldSchema(schema.properties![key], key)
      ).toMatchObject({
        type: "datetime"
      });
    });

    it("supports description to help text mapping", async () => {
      const key = "stringProp";
      const type = generator.getFieldSchema(schema.properties![key], key);
      expect(type).toEqual(
        expect.objectContaining({
          helpText: schema.properties![key].description
        })
      );
    });

    it(" returns empty children for empty array items type", async () => {
      const key = "arrayProp";
      expect(generator.getFieldSchema(schema.properties![key], key)).toEqual(
        expect.objectContaining({
          children: []
        })
      );
    });

    it(" returns null for anyOf type", async () => {
      const key = "anyOfProp";
      expect(generator.getFieldSchema(schema.properties![key], key)).toBeNull();
    });
  });

  describe("$ref", () => {
    const registry = Registry.fromDefinition(schema);
    it("supports $ref enum types", async () => {
      const key = "enumRef";
      const clone = _.cloneDeep(schema);
      generator.dehydrateRefs(registry, clone);

      expect(clone.properties![key]).toEqual(
        expect.objectContaining({
          enum: ["option1", "option2"]
        })
      );
    });

    it("supports $ref object types", async () => {
      const key = "nestedRef";
      const clone = _.cloneDeep(schema);
      generator.dehydrateRefs(registry, clone);

      expect(clone.properties![key]).toEqual(
        expect.objectContaining({
          properties: expect.any(Object)
        })
      );
    });
  });

  describe("Options", () => {
    it("excludes fileds when in options declared", async () => {
      const types = generator.getZapierSchema(schema, {
        excludes: ["nestedRef"]
      });
      expect(types.length).toEqual(9);
    });

    it("prefers nested include over general exclude", async () => {
      const types = generator.getZapierSchema(schema, {
        excludes: ["nestedRef"],
        includes: ["nestedRef.stringProp"]
      });
      expect(types.length).toEqual(10);
    });

    it("exclude all other but respected includes", async () => {
      const types = generator.getZapierSchema(schema, {
        excludeAll: true,
        includes: ["nestedRef.stringProp"]
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
    expect(types.length).toEqual(11);
  });

  it("uses Zapier unsercore keys", async () => {
    const key = "nestedRef";
    const schemas = generator.getZapierSchema(schema);
    const startWithDoubleUnderscore = schemas
      .map((prop: any) => prop.key)
      .filter(propKey => propKey.startsWith(key))
      .filter((keyInList: string) => !keyInList.includes(key + "__"));
    expect(startWithDoubleUnderscore.length).toEqual(0);
  });
});
