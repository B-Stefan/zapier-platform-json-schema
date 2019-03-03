[![Build Status](https://travis-ci.org/B-Stefan/zapier-platform-json-schema.svg?branch=master)](https://travis-ci.org/B-Stefan/zapier-platform-json-schema)
# Zapier Platform JSON Schema

This project converts json Schema to the ZapierPlatform schema

## Getting started

* `npm install zapier-platform-json-schema --save`

* `yarn add install zapier-platform-json-schema`

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

## Test
To run the test just use the yarn script:
`yarn test`

## Release
Just add a new tag via github or `git tag` please use [Semantic Versioning 2.0.0](https://semver.org/#semantic-versioning-200)

