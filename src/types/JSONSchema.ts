export type PrimitiveType = number | boolean | string | null;

export interface JSONSchema {
    $ref?: string;
    $schema?: string;
    $id?: string;
    description?: string;
    examples?: any[];
    allOf?: JSONSchema[];
    oneOf?: JSONSchema[];
    anyOf?: JSONSchema[];
    title?: string;
    type?: string | string[];
    definitions?: {[key: string]: any};
    format?: string;
    items?: JSONSchema | JSONSchema[];
    minItems?: number;
    additionalItems?: {
        anyOf: JSONSchema[]
    } | JSONSchema;
    enum?: PrimitiveType[] | JSONSchema[];
    default?: PrimitiveType | object;
    additionalProperties?: JSONSchema | boolean;
    required?: string[];
    propertyOrder?: string[];
    properties?: {[key: string]: any};
    defaultProperties?: string[];
    patternProperties?: {[pattern: string]: JSONSchema};
    typeof?: "function";
}
