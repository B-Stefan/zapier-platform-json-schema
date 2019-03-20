import { JSONSchema } from "./types/JSONSchema";
import { FieldSchema } from "./types/FieldSchema";
import Registry from "./Registry";
import Utils from "./Utils";

interface ZapierSchemaGeneratorOptions {
  excludeAll: boolean;
  excludes: string[];
  includes: string[];
  overrides: Map<string, any>;
  registry?: Registry;
}

export default class ZapierSchemaGenerator {
  public getZapierSchema(
    def: JSONSchema,
    options?: Partial<ZapierSchemaGeneratorOptions>
  ): FieldSchema[] {
    const safeOptions = {
      includes: [],
      excludes: [],
      excludeAll: false,
      overrides: new Map(),
      ...options
    } as ZapierSchemaGeneratorOptions;

    if (!safeOptions.registry) {
      safeOptions.registry = Registry.fromDefinition(def);
    }

    const props = this.convertJsonSchema(safeOptions.registry, def);
    const flatten = Utils.flatten<FieldSchema>(props).filter(
      entry => entry !== null
    );

    const filtered = this.filterByOptions(flatten, safeOptions);
    return this.injectOverrides(filtered, safeOptions);
  }
  public getNestedRefTypes(registry: Registry, prop: any, key: string) {
    const name = prop.$ref.split("/").pop();
    const def = registry.getDefinition(name);
    const props = this.convertJsonSchema(registry, def);
    if (props instanceof Array) {
      return props
        .filter((nested: any) => nested !== null)
        .map((nested: any) => {
          return {
            ...nested,
            key: Utils.getZapierReference(key + "." + nested.key)
          };
        });
    }
    return [{ key, ...this.getPrimitiveType(def) }];
  }
  // FIXME: Change to private only for testing public
  public getPrimitiveType(prop: any): Partial<FieldSchema> | null {
    const fieldSchema = {} as Partial<FieldSchema>;
    if (prop.enum) {
      fieldSchema.choices = prop.enum;
    }
    if (prop.format === "date-time") {
      fieldSchema.type = "datetime";
    } else if (prop.type === "array") {
      const arrayItems = prop.items;
      const listType = this.getPrimitiveType(arrayItems);

      if (listType) {
        return { ...listType, list: true };
      }
      return null;
    } else if (prop.type === "object") {
      return null;
    } else if (prop.type && prop.type instanceof Array) {
      fieldSchema.type = prop.type
        .filter((entry: any) => entry !== "string")
        .pop();
    } else if (!prop.type) {
      return null;
    } else {
      fieldSchema.type = prop.type;
    }
    return fieldSchema;
  }

  private filterByOptions(
    props: FieldSchema[],
    options: ZapierSchemaGeneratorOptions
  ) {
    return props.filter((prop: FieldSchema) => {
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

  private injectOverrides(
    props: FieldSchema[],
    options: ZapierSchemaGeneratorOptions
  ): FieldSchema[] {
    const dict = props.reduce<{ [x: string]: FieldSchema }>((acc, current) => {
      acc[current.key] = current;
      return acc;
    }, {});

    Array.from(options.overrides.entries()).map(([key, value]) => {
      const found = dict[key];
      if (!found) {
        return;
      }
      dict[key] = { ...found, ...value };
    });
    return Object.values(dict);
  }

  private convertJsonSchema(registry: Registry, current: JSONSchema): any {
    if (!current.properties) {
      return this.getPrimitiveType(current);
    }
    return Object.entries(current.properties!).map(([key, prop]) => {
      if (prop.$ref) {
        const nestedProps = this.getNestedRefTypes(registry, prop, key);
        if (nestedProps.length === 1) {
          return nestedProps.pop();
        }
        return nestedProps;
      }
      if (!this.getPrimitiveType(prop)) {
        return null;
      }
      return { key, ...this.getPrimitiveType(prop) };
    });
  }
}
