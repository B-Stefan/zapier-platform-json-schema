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
  children?: FieldSchema[];
  dict?: boolean;
  computed?: boolean;
  altersDynamicFields?: boolean;
  inputFormat?: string;
}

export enum FieldSchemaKeys {
  Key = "key",
  Label = "key",
  HelpText = "key",
  Type = "key",
  Required = "key",
  Placeholder = "key",
  Default = "key",
  Dynamic = "key",
  Search = "key",
  Choices = "key",
  List = "key",
  Children = "key",
  Dict = "key",
  Computed = "key",
  AltersDynamicFields = "key",
  InputFormat = "key"
}
