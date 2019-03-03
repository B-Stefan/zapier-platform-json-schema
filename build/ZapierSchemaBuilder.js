"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ZapierSchemaGenerator_1 = require("./ZapierSchemaGenerator");
class ZapierSchemaBuilder {
  constructor(schema) {
    this.schema = schema;
    this.includes = [];
    this.excludes = [];
    this.excludeAll = false;
  }
  static getZapierReference(key) {
    if (key.indexOf(".") > -1) {
      return key.replace(new RegExp(".", "g"), "__");
    }
    return key;
  }
  addInclude(key) {
    this.includes.push(ZapierSchemaBuilder.getZapierReference(key));
    return this;
  }
  addExclude(key) {
    this.excludes.push(ZapierSchemaBuilder.getZapierReference(key));
    return this;
  }
  setExcludeAll(value) {
    this.excludeAll = value;
    return this;
  }
  build() {
    return new ZapierSchemaGenerator_1.default().getZapierSchema(this.schema, {
      excludeAll: this.excludeAll,
      excludes: this.excludes,
      includes: this.includes
    });
  }
}
exports.default = ZapierSchemaBuilder;
