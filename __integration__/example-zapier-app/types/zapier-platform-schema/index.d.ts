declare module "zapier-platform-schema" {
  export function validateAppDefinition(
    defintion: unknown
  ): {
    [key: string]: any;
    errors?: Error[];
  };
  export function exportSchema(): unknown;
}
