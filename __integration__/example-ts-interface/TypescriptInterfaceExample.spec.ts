import { resolve } from "path";
import * as TJS from "typescript-json-schema";
import ZapierSchemaBuilder from "../../src/ZapierSchemaBuilder";

describe("Example: Typescript interface", () => {
  it("get a zapier schema from ts interface", () => {
    const program = TJS.getProgramFromFiles([
      resolve(__dirname + "/ExampleInterface.ts")
    ]);
    const schema = TJS.generateSchema(program, "ExampleInterface");

    if (!schema) {
      throw new Error("No schema found!");
    }
    const zapierSchema = new ZapierSchemaBuilder(schema).build();

    expect(zapierSchema).not.toBe(null);
  });
});
