import * as _ from "lodash";
export default class Utils {
  public static getZapierReference(key: string): string {
    return key.replace(/\./g, "__");
  }
  public static getDotNotationnReference(key: string): string {
    return key.replace(/__/g, ".");
  }

  public static getNestedObject(obj: { [x: string]: any }) {
    const newObj = {};
    Object.entries(obj).map(([key, value]) => {
      _.set(newObj, Utils.getDotNotationnReference(key), value);
    });
    return newObj;
  }
}
