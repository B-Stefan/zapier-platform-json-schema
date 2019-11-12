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
      this.set(newObj, Utils.getDotNotationnReference(key), value);
    });
    return newObj;
  }
  public static flatten<G>(arr: any[]): G[] {
    return arr.reduce((flat, toFlatten) => {
      return flat.concat(
        Array.isArray(toFlatten) ? Utils.flatten<G>(toFlatten) : toFlatten
      );
    }, []);
  }
  /* tslint:disable */
  // Source: https://stackoverflow.com/questions/54733539/javascript-implementation-of-lodash-set-method
  private static set(obj: object, path: any, value: any) {
    if (Object(obj) !== obj) return obj; // When obj is not an object
    // If not yet an array, get the keys from the string-path
    if (!Array.isArray(path)) path = path.toString().match(/[^.[\]]+/g) || [];
    path.slice(0, -1).reduce(
      (
        a: any,
        c: any,
        i: any // Iterate all of them except the last one
      ) =>
        Object(a[c]) === a[c] // Does the key exist and is its value an object?
          ? // Yes: then follow that path
            a[c]
          : // No: create the key. Is the next key a potential array-index?
            (a[c] =
              Math.abs(path[i + 1]) >> 0 === +path[i + 1]
                ? [] // Yes: assign a new array object
                : {}), // No: assign a new plain object
      obj
    )[path[path.length - 1]] = value; // Finally assign the value to the last key
    return obj; // Return the top-level object to allow chaining
  }
  /* tslint:enable */
}
