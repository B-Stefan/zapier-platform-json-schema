import ZapierSchemaGenerator from "../src/ZapierSchemaGenerator";
import ZapierSchemaBuilder from "../src/ZapierSchemaBuilder";
import { mocked } from "ts-jest/utils";
import { JSONSchema } from "../src/types/JSONSchema";
import Registry from "../src/Registry";
import { FieldSchemaKey } from "../src/types/FieldSchema";

// tslint:disable-next-line
const schema = require("./Example.schema.json") as JSONSchema;

jest.mock("../src/ZapierSchemaGenerator");

describe("ZapierSchemaBuilder", () => {
  const getZapierSchemaMock = jest.fn();
  mocked(ZapierSchemaGenerator).mockImplementation(() => ({
    getZapierSchema: getZapierSchemaMock
  }));
  let builder: ZapierSchemaBuilder;

  beforeEach(() => {
    builder = new ZapierSchemaBuilder(schema);
    getZapierSchemaMock.mockReset();
  });

  it("builds with registry option", async () => {
    const registryMock = {} as Registry;
    builder.setRegistry(registryMock).build();

    expect(getZapierSchemaMock).toBeCalledWith(
      expect.any(Object),
      expect.objectContaining({
        registry: registryMock
      })
    );
  });
  it("builds with override option", async () => {
    const registryMock = {} as Registry;
    const overrideObj = { [FieldSchemaKey.HelpText]: "helpTextOverride" };
    builder.addOverride("dateProp", overrideObj).build();

    expect(getZapierSchemaMock).toBeCalledWith(
      expect.any(Object),
      expect.objectContaining({
        overrides: new Map([["dateProp", overrideObj]])
      })
    );
  });
  it("builds with exclude option", async () => {
    builder.addExclude("exclude").build();

    expect(getZapierSchemaMock).toBeCalledWith(
      expect.any(Object),
      expect.objectContaining({
        excludes: ["exclude"]
      })
    );
  });

  it("builds with exclude option", async () => {
    const excludeFn = () => true;
    builder.addExclude(excludeFn).build();

    expect(getZapierSchemaMock).toBeCalledWith(
      expect.any(Object),
      expect.objectContaining({
        excludes: [excludeFn]
      })
    );
  });

  it("builds with includes option", async () => {
    builder.addInclude("include").build();

    expect(getZapierSchemaMock).toBeCalledWith(
      expect.any(Object),
      expect.objectContaining({
        includes: ["include"]
      })
    );
  });

  it("builds with excludeAll option", async () => {
    builder.setExcludeAll(true).build();

    expect(getZapierSchemaMock).toBeCalledWith(
      expect.any(Object),
      expect.objectContaining({
        excludeAll: true
      })
    );
  });

  it("builds with the schema", async () => {
    builder.build();

    expect(getZapierSchemaMock).toBeCalledWith(schema, expect.any(Object));
  });
});
