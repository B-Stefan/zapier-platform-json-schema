[![Build Status](https://travis-ci.org/B-Stefan/zapier-platform-json-schema.svg?branch=master)](https://travis-ci.org/B-Stefan/zapier-platform-json-schema)
# Zapier Platform JSON Schema

This project converts json Schema to the ZapierPlatform schema with zero runtime dependencies.

## Getting started

* `npm install zapier-platform-json-schema --save`

* `yarn add zapier-platform-json-schema`

```javascript

const {default: ZapierSchemaBuilder} = require ("zapier-platform-json-schema");

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

```

## Features
The following list summarize the current scope and supported features of this lib.

| Feature       | Status        | Comment|
| ------------- |:-------------:| -----:|
| strings       | ✅ | [Example](./__tests__/ZapierSchemaGenerator.spec.ts#L10) |
| boolean       | ✅ | [Example](./__tests__/ZapierSchemaGenerator.spec.ts#L10) |
| datetime      | ✅ | [Example](./__tests__/ZapierSchemaGenerator.spec.ts#L10) |
| enum          | ✅ | [Example](./__tests__/ZapierSchemaGenerator.spec.ts#L10) |
| array of enum | ✅ | [Example](./__tests__/ZapierSchemaGenerator.spec.ts#L10) |
| array         | ❌ |   |
| anyOf         | ❌ |   |
| anyOf prefer non-string        | ✅ |  [Example](./__tests__/ZapierSchemaGenerator.spec.ts#L10)  |
| $ref to external| ❌ |     |
| $ref to object| ✅ |    [Example](./__tests__/ZapierSchemaGenerator.spec.ts#L64) |
| $ref to enum  | ✅ |    [Example](./__tests__/ZapierSchemaGenerator.spec.ts#L64) |
| get nested defeintion  |  ✅  |  [Example](./__integration__/example-builder-options/ExampleBuilderOptions.spec.ts#L16) |
| Additional props  |   ✅   |  [Example](./__integration__/example-builder-options/ExampleBuilderOptions.spec.ts#L25)  |
| required      | ✅ | [Example](./__integration__/example-builder-options/ExampleBuilderOptions.spec.ts#L25) |
| label         | ✅ | [Example](./__integration__/example-builder-options/ExampleBuilderOptions.spec.ts#L25) |


## Test
To run the test just use the yarn script:
`yarn test`

## Release
Just add a new tag via github or `git tag` please use [Semantic Versioning 2.0.0](https://semver.org/#semantic-versioning-200)

