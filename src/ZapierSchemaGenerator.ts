import { JSONSchema } from "./types/JSONSchema";
import { FieldSchema } from "./types/FieldSchema";
import Registry from "./Registry";

interface ZapierSchemaGeneratorOptions {
  nestedName: string | null;
  excludeAll: boolean;
  excludes: string[];
  includes: string[];
  registry?: Registry;
}

export default class ZapierSchemaGenerator {
  public getZapierSchema(
    def: JSONSchema,
    options?: Partial<ZapierSchemaGeneratorOptions>
  ): FieldSchema[] {
    const reg =
      options && options.registry
        ? options.registry
        : Registry.fromDefinition(def);
    const props = this.convertJsonSchema(reg, def);
    const flatten = [].concat.apply([], props);

    const flatProps = flatten.filter(entry => entry !== null);

    if (options) {
      const currentOptions = {
        nestedName: null,
        includes: [],
        excludes: [],
        excludeAll: false,
        ...options
      };
      return this.filterByOptions(flatProps, currentOptions);
    }
    return flatProps;
  }
  public getNestedRefTypes(registry: Registry, prop: any, key: string) {
    const name = prop.$ref.split("/").pop();
    const def = registry.getDefinition(name);
    const props = this.convertJsonSchema(registry, def);
    if (!props.map) {
      const entry = prop;
      return this.getPrimitiveType(key, def);
    }
    return props
      .filter((nested: any) => nested !== null)
      .map((nested: any) => {
        return { ...nested, key: key + "__" + nested.key };
      });
  }
  // FIXME: Change to private only for testing public
  public getPrimitiveType(key: string | null, prop: any): FieldSchema | null {
    const additional = {} as Partial<FieldSchema>;
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
      additional.type = prop.type
        .filter((entry: any) => entry !== "string")
        .pop();
    } else {
      additional.type = prop.type;
    }
    return {
      key,
      ...additional
    } as FieldSchema;
  }

  private filterByOptions(
    props: FieldSchema[],
    options: ZapierSchemaGeneratorOptions
  ) {
    return props.filter((prop: FieldSchema) => {
      //  console.log("options", options.excludes, prop.key)

      if (options.includes.find(include => prop.key.indexOf(include) > -1)) {
        return true;
      }
      // Exclude rules
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
  private convertJsonSchema(registry: Registry, current: JSONSchema): any {
    if (!current.properties) {
      return this.getPrimitiveType(null, current);
    }
    return Object.keys(current.properties!).map(key => {
      const prop = current.properties![key];
      if (prop.$ref) {
        return this.getNestedRefTypes(registry, prop, key);
      }
      return this.getPrimitiveType(key, prop);
    });
  }
}
