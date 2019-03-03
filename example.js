const {default: ZapierSchemaBuilder} = require ("./build/ZapierSchemaBuilder");

const schema = {
    "type": "object",
    "properties": {
        "stringProp": {
            "type": "string"
        },
        "excludedProp": {
            "type": "string"
        },
    },
};

console.log(new ZapierSchemaBuilder(schema)
  .addExclude("excludedProp")
  .build());

// prints: [ { key: 'stringProp', type: 'string' } ]

