import ZapierSchemaGenerator from "../src/ZapierSchemaGenerator";
import ZapierSchemaBuilder from "../src/ZapierSchemaBuilder";
import { mocked } from "ts-jest/utils";
import { JSONSchema } from "../src/types/JSONSchema";
import Registry from "../src/Registry";

// tslint:disable-next-line
const schema = require("./Example.schema.json") as JSONSchema;

jest.mock("../src/ZapierSchemaGenerator");

describe("Registry", () => {
  let reg: Registry;
  beforeEach(() => {
    reg = new Registry();
  });

  describe("getFromDefinition", () => {
    it("adds the defintion as root", () => {
      const regStatic = Registry.fromDefinition(schema);
      expect(regStatic.getDefinition("root")).toEqual(schema);
    });
    it("adds nested defintions", () => {
      const regStatic = Registry.fromDefinition(schema);
      expect(regStatic.getDefinition("NestedRef")).toEqual(
        schema.definitions!.NestedRef
      );
    });
  });

  it("sets the definition", async () => {
    reg.setDefinition("root", schema);
    expect(reg.getDefinition("root")).toEqual(schema);
  });
  it("gets the definition", async () => {
    reg.setDefinition("root", schema);
    reg.setDefinition("second", { definitions: { test: "test" } });
    expect(reg.getDefinition("root")).toEqual(schema);
  });
  it("overrides the first one", async () => {
    const second = { $id: "test" };
    reg.setDefinition("root", schema);
    reg.setDefinition("root", second);
    expect(reg.getDefinition("root")).toEqual(second);
  });
  it("throw if not found ", async () => {
    reg.setDefinition("root", schema);
    expect(() => reg.getDefinition("notFound")).toThrowError();
  });
});
