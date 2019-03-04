import { JSONSchema } from "./types/JSONSchema";

export default class Registry {
  public static fromDefinition(def: JSONSchema, prefix?: string): Registry {
    const reg = new Registry();
    reg.setDefinition(Registry.getName("root", prefix), def);
    if (def.definitions) {
      Object.entries(def.definitions).forEach(([key, value]) => {
        reg.setDefinition(Registry.getName(key, prefix), value);
      });
    }
    return reg;
  }
  private static getName(key: string, prefix: string | undefined) {
    if (!prefix) {
      return key;
    }
    return [prefix, key].join("/");
  }
  private readonly map: Map<string, JSONSchema> = new Map();

  public setDefinition(name: string, def: JSONSchema) {
    this.map.set(name, def);
  }
  public getDefinition(name: string): JSONSchema {
    const def = this.map.get(name);
    if (!def) {
      throw new Error("Unknown schema name: " + name);
    }
    return def;
  }
}
