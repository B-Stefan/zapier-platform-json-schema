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
