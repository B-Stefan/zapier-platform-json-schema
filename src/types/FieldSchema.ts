export interface FieldSchema {
  key: string;
  label?: string;
  helpText?: string;
  type?:
    | "string"
    | "text"
    | "integer"
    | "number"
    | "boolean"
    | "datetime"
    | "file"
    | "password"
    | "copy";
  required?: boolean;
  placeholder?: string;
  default?: string;
  dynamic?: any;
  search?: any;
  choices?: any[];
  list?: boolean;
  children?: FieldSchema[] | null;
  dict?: boolean;
  computed?: boolean;
  altersDynamicFields?: boolean;
  inputFormat?: string;
}

export enum FieldSchemaKey {
  Key = "Key",
  Label = "label",
  HelpText = "hjelpText",
  Type = "type",
  Required = "required",
  Placeholder = "placeholder",
  Default = "default",
  Dynamic = "dynamic",
  Search = "search",
  Choices = "choices",
  List = "list",
  Children = "children",
  Dict = "dict",
  Computed = "computed",
  AltersDynamicFields = "altersDynamicFields",
  InputFormat = "inputFormat"
}
