import Utils from "../src/Utils";

jest.mock("../src/ZapierSchemaGenerator");

describe("Utils", () => {
  describe("getZapierReference", () => {
    it("converts dot notation into zapier notation", () => {
      expect(Utils.getZapierReference("nested.nested")).toEqual(
        "nested__nested"
      );
    });
    it("converts multiple dot notation into zapier notation", () => {
      expect(Utils.getZapierReference("nested.nested.nested")).toEqual(
        "nested__nested__nested"
      );
    });
    it("don't alter strings with no dots", () => {
      expect(Utils.getZapierReference("noDotStrinng")).toEqual("noDotStrinng");
    });
  });

  describe("getDotReference", () => {
    it("converts zapier notation into dot  notation", () => {
      expect(Utils.getDotNotationnReference("nested__nested")).toEqual(
        "nested.nested"
      );
    });
    it("converts multiple levels into dot notation", () => {
      expect(Utils.getDotNotationnReference("nested__nested__nested")).toEqual(
        "nested.nested.nested"
      );
    });
    it("don't alter strings with no double underscores", () => {
      expect(
        Utils.getDotNotationnReference("noDoubleUnderscoreString")
      ).toEqual("noDoubleUnderscoreString");
    });
  });

  describe("getNestedObject", () => {
    it("returns a nested object based on zapier refs", () => {
      expect(
        Utils.getNestedObject({
          nested__var: "test"
        })
      ).toEqual({ nested: { var: "test" } });
    });
    it("merges multiple nested vars into one object", () => {
      expect(
        Utils.getNestedObject({
          nested__var: "test",
          nested__var2: "test2",
          nested__var3: "test3"
        })
      ).toEqual({
        nested: {
          var: "test",
          var2: "test2",
          var3: "test3"
        }
      });
    });

    it("supports multi level nesting", () => {
      expect(
        Utils.getNestedObject({
          nested__var: "test",
          nested__nested__var: "test2",
          nested__nested__nested__var: "test3"
        })
      ).toEqual({
        nested: {
          var: "test",
          nested: {
            var: "test2",
            nested: { var: "test3" }
          }
        }
      });
    });
  });
});
