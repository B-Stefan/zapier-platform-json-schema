import { Definition } from "typescript-json-schema";
import ZapierSchemaGenerator from "../src/ZapierSchemaGenerator";
import ZapierSchemaBuilder from "../src/ZapierSchemaBuilder";
import { mocked } from "ts-jest/utils";

// tslint:disable-next-line
const schema = require("./Example.schema.json") as Definition;

jest.mock("../src/ZapierSchemaGenerator");

describe("ZapierSchemaBuilder", () => {
  let getZapierSchemaMock = jest.fn();
  mocked(ZapierSchemaGenerator).mockImplementation(() => ({
    getZapierSchema: getZapierSchemaMock
  }));
  const builder = new ZapierSchemaBuilder(schema);

  beforeEach(() => {
    getZapierSchemaMock.mockReset();
  });

  describe("getZapierReference", () => {
    it("converts dot notation into zapier notation", () => {
      expect(ZapierSchemaBuilder.getZapierReference("nested.nested")).toEqual(
        "nested__nested"
      );
    });
    it("converts multiple dot notation into zapier notation", () => {
      expect(
        ZapierSchemaBuilder.getZapierReference("nested.nested.nested")
      ).toEqual("nested__nested__nested");
    });
    it("dont alter strings with no dots", () => {
      expect(ZapierSchemaBuilder.getZapierReference("noDotStrinng")).toEqual(
        "noDotStrinng"
      );
    });
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
