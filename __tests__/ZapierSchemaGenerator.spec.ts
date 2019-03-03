import { Definition } from "typescript-json-schema";
import ZapierSchemaGenerator from "../src/ZapierSchemaGenerator";

// tslint:disable-next-line
const schema = require("./Example.schema.json") as Definition;

describe("ZapierSchemaGenerator", () => {
  const generator = new ZapierSchemaGenerator();

  describe("PrimitiveTypes", () => {
    it("supports string type", async () => {
      const key = "stringProp";
      const type = generator.getPrimitiveType(key, schema.properties![key]);
      expect(type).toEqual({
        key: "stringProp",
        type: "string"
      });
    });
    it("supports boolean type", async () => {
      const key = "booleanProp";
      const type = generator.getPrimitiveType(key, schema.properties![key]);
      expect(type).toEqual({
        key,
        type: "boolean"
      });
    });

    it("supports datetime type", async () => {
      const key = "dateProp";
      const type = generator.getPrimitiveType(key, schema.properties![key]);
      expect(type).toEqual({
        key,
        type: "datetime"
      });
    });

    it("supports enum type", async () => {
      const key = "enumProp";
      const type = generator.getPrimitiveType(key, schema.properties![key]);
      expect(type).toEqual({
        key,
        type: "string",
        choices: ["option1"]
      });
    });

    it("supports multiple types (prefer non-string)", async () => {
      const key = "multipleTypeProp";
      const type = generator.getPrimitiveType(key, schema.properties![key]);
      expect(type).toEqual({
        key,
        type: "boolean"
      });
    });

    it(" returns null for not supported array type", async () => {
      const key = "arrayProp";
      expect(
        generator.getPrimitiveType(key, schema.properties![key])
      ).toBeNull();
    });
  });

  describe("$ref", () => {
    it("supports $ref enum types", async () => {
      const key = "enumRef";
      const type = generator.getNestedRefTypes(
        schema,
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
        schema,
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
      expect(types.length).toEqual(7);
    });

    it("prefers nested include over general exclude", async () => {
      const types = generator.getZapierSchema(schema, {
        excludes: ["nestedRef"],
        includes: ["nestedRef__stringProp"]
      });
      expect(types.length).toEqual(8);
    });

    it("exclude all other but respected includes", async () => {
      const types = generator.getZapierSchema(schema, {
        excludeAll: true,
        includes: ["nestedRef__stringProp"]
      });
      expect(types.length).toEqual(1);
    });
  });

  it("flatten all nested types", async () => {
    const types = generator.getZapierSchema(schema);
    expect(types.length).toEqual(9);
  });

  it("uses Zapier unsercore keys", async () => {
    const key = "nestedRef";
    const types = generator.getNestedRefTypes(
      schema,
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
