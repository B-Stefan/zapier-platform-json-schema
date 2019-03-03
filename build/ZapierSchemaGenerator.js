"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ZapierSchemaGenerator {
  getZapierSchema(def, options) {
    let props;
    if (options && options.nestedName) {
      if (!def.definitions) {
        throw new Error(`No nested definitions in dev ${JSON.stringify(def)}`);
      }
      const nestedDef = def.definitions[options.nestedName];
      if (!nestedDef) {
        throw new Error(
          `Can't find def with the name: ${
            options.nestedName
          } - ${JSON.stringify(def)}`
        );
      }
      props = this.convertJsonSchema(def, nestedDef);
    } else {
      props = this.convertJsonSchema(def, def);
    }
    const flatten = [].concat.apply([], props);
    const flatProps = flatten.filter(entry => entry !== null);
    if (options) {
      const currentOptions = Object.assign(
        { nestedName: null, includes: [], excludes: [], excludeAll: false },
        options
      );
      return this.filterByOptions(flatProps, currentOptions);
    }
    return flatProps;
  }
  getNestedRefTypes(root, prop, key) {
    const name = prop.$ref.split("/").pop();
    const def = root.definitions[name];
    const props = this.convertJsonSchema(root, def);
    if (!props.map) {
      const entry = prop;
      return this.getPrimitiveType(key, def);
    }
    return props
      .filter(nested => nested !== null)
      .map(nested => {
        return Object.assign({}, nested, { key: key + "__" + nested.key });
      });
  }
  getPrimitiveType(key, prop) {
    const additional = {};
    if (prop.enum) {
      additional.choices = prop.enum;
    }
    if (prop.format === "date-time") {
      additional.type = "datetime";
    } else if (prop.type === "array") {
      return null;
    } else if (prop.type === "object") {
      return null;
    } else if (prop.type && prop.type.filter instanceof Function) {
      additional.type = prop.type.filter(entry => entry !== "string").pop();
    } else {
      additional.type = prop.type;
    }
    return Object.assign({ key }, additional);
  }
  filterByOptions(props, options) {
    return props.filter(prop => {
      if (options.includes.find(include => prop.key.indexOf(include) > -1)) {
        return true;
      }
      if (options.excludeAll) {
        return false;
      } else if (
        options.excludes.find(exclude => prop.key.indexOf(exclude) > -1)
      ) {
        return false;
      }
      return true;
    });
  }
  convertJsonSchema(root, current) {
    if (!current.properties) {
      return this.getPrimitiveType(null, current);
    }
    return Object.keys(current.properties).map(key => {
      const prop = current.properties[key];
      if (prop.$ref) {
        return this.getNestedRefTypes(root, prop, key);
      }
      return this.getPrimitiveType(key, prop);
    });
  }
}
exports.default = ZapierSchemaGenerator;
