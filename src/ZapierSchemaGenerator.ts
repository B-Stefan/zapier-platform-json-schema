import { JSONSchema } from "./types/JSONSchema";
import { FieldSchema } from "./types/FieldSchema";
import Registry from "./Registry";
import Utils from "./Utils";
import { transformDate } from "./transforms/transformDate";
import { transformItems } from "./transforms/transformItems";
import { transformAnyOf } from "./transforms/transformAnyOf";
import { transformDefault } from "./transforms/transformDefault";
import * as _ from "lodash";
import { transformObject } from "./transforms/transformObject";
import { transformAllOf } from "./transforms/transformAllOf";

export type filterFn = (field: FieldSchema) => boolean;

interface ZapierSchemaGeneratorOptions {
  excludeAll: boolean;
  excludes: Array<string | filterFn>;
  includes: Array<string | filterFn>;
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

    this.dehydrateRefs(safeOptions.registry, def);

    const schema = this.getFieldSchema(def, "");

    if (!schema) {
      throw new Error(`Unabled to get field schema ${def}`);
    }

    const flatten = Utils.flatten<FieldSchema>(this.getFieldSchemaArray(
      schema
    ) as FieldSchema[]).filter(value => value !== null);

    const filtered = this.filterByOptions(flatten, safeOptions);

    const overrides = this.injectOverrides(filtered, safeOptions);

    return overrides.map(value => {
      return { ...value, key: Utils.getZapierReference(value.key) };
    });
  }

  // FIXME: Change to private only for testing public
  public getFieldSchema(
    prop: any,
    key: string,
    parentKey?: string
  ): Partial<FieldSchema> | null {
    const fieldSchema = {} as Partial<FieldSchema>;
    if (prop.enum) {
      fieldSchema.choices = prop.enum;
    }

    if (prop.type && prop.type instanceof Array) {
      const types = prop.type;
      prop.type = types.filter((entry: any) => entry !== "string").pop();
      if (prop.type === "null") {
        prop.type = types.filter((entry: any) => entry !== "null").pop();
      }
    }

    fieldSchema.key = (parentKey ? parentKey + "." : "") + key;

    if (prop.description) {
      fieldSchema.helpText = prop.description;
    }
    if (prop.title) {
      fieldSchema.label = prop.title;
    }

    if (prop.format === "date-time") {
      transformDate(fieldSchema, prop, this);
    } else if (prop.type === "array") {
      return transformItems(fieldSchema, prop, this);
    } else if (prop.type === "object") {
      return transformObject(fieldSchema, prop, this);
    } else if (prop.anyOf) {
      return transformAnyOf(fieldSchema, prop, this);
    } else if (prop.allOf) {
      return transformAllOf(fieldSchema, prop, this);
    } else if (!prop.type) {
      return null;
    } else {
      transformDefault(fieldSchema, prop, this);
    }
    return fieldSchema;
  }

  public dehydrateRefs(registry: Registry, current: JSONSchema) {
    if (current.properties) {
      Object.values(current.properties).forEach((prop: any) =>
        this.dehydrateRefs(registry, prop)
      );
    }
    if (current.anyOf) {
      current.anyOf.forEach((entry: any) =>
        this.dehydrateRefs(registry, entry)
      );
    }
    if (current.allOf) {
      current.allOf.forEach((entry: any) =>
        this.dehydrateRefs(registry, entry)
      );
    }
    if (current.oneOf) {
      current.oneOf.forEach((entry: any) =>
        this.dehydrateRefs(registry, entry)
      );
    }
    if (!current.$ref) {
      return;
    }

    const name = current.$ref.split("/").pop();
    if (!name) {
      throw new Error(`Unabled to parse ref: ${current.$ref}`);
    }
    const def = registry.getDefinition(name);

    this.dehydrateRefs(registry, def);

    Object.assign(current, _.merge(current, def));
  }

  private getFieldSchemaArray(
    fieldSchema: Partial<FieldSchema>
  ): Array<Partial<FieldSchema>> | Partial<FieldSchema> | null {
    if (!fieldSchema) {
      return null;
    }
    if (fieldSchema.children) {
      // @ts-ignore
      return fieldSchema.children.map(schema =>
        this.getFieldSchemaArray(schema)
      );
    }
    return fieldSchema;
  }
  private filterByOptions(
    props: FieldSchema[],
    options: ZapierSchemaGeneratorOptions
  ) {
    return props.filter(prop => {
      if (
        options.includes.find(include => {
          if (typeof include === "function") {
            return include(prop);
          }
          return prop.key.indexOf(include) > -1;
        })
      ) {
        return true;
      }
      // Exclude rules
      if (options.excludeAll) {
        return false;
      } else if (
        options.excludes.find(exclude => {
          if (typeof exclude === "function") {
            return exclude(prop);
          }
          return prop.key.indexOf(exclude) > -1;
        })
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
}
