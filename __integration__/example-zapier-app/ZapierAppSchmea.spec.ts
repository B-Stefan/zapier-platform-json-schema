import { validateAppDefinition } from "zapier-platform-schema";
import ZapierSchemaBuilder from "../../src/ZapierSchemaBuilder";
// tslint:disable
const AppDefinition = require("./app-example-defintion.json");
const schema = require("./input-example.schema.json");
// tslint:enable

describe("Example: Zapier-Platform-Schema", () => {
  it("generate a valid app schema", () => {
    const definition = Object.assign({}, AppDefinition);

    definition.creates.contact_create.operation.inputFields = new ZapierSchemaBuilder(
      schema
    ).build();

    expect(validateAppDefinition(definition).errors).toEqual([]);
  });

  it("fails with an error on wrong input field", () => {
    const definition = Object.assign({}, AppDefinition);

    definition.creates.contact_create.operation.inputFields = [
      { someNotValidInputFields: "test" }
    ];

    expect(validateAppDefinition(definition).errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          property: "instance.creates.contact_create.operation.inputFields[0]"
        })
      ])
    );
  });
});
