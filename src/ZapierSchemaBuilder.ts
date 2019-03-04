import ZapierSchemaGenerator from "./ZapierSchemaGenerator";

import { JSONSchema } from "./types/JSONSchema";

import { FieldSchema } from "./types/FieldSchema";
import Utils from "./Utils";

export default class ZapierSchemaBuilder {
  private includes: string[] = [];

  private excludes: string[] = [];

  private excludeAll: boolean = false;

  constructor(private schema: JSONSchema) {}

  public addInclude(key: string) {
    this.includes.push(Utils.getZapierReference(key));
    return this;
  }
  public addExclude(key: string) {
    this.excludes.push(Utils.getZapierReference(key));
    return this;
  }

  public setExcludeAll(value: boolean) {
    this.excludeAll = value;
    return this;
  }

  public build(): FieldSchema[] {
    return new ZapierSchemaGenerator().getZapierSchema(this.schema, {
      excludeAll: this.excludeAll,
      excludes: this.excludes,
      includes: this.includes
    });
  }
}
