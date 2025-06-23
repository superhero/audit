# Audit

Licence: [MIT](https://opensource.org/licenses/MIT)

---

## Reporter

A custom reporter implementation.

### Example

**package.json:**

```json
{
  "name": "app",
  "scripts": {
    "test": "node --test --test-reporter=@superhero/audit/reporter --experimental-test-coverage"
  },
  "devDependencies": {
    "@superhero/audit": "*"
  }
}
```

**Run test using npm:**

```bash
npm test
```

### Output

Example from the `@superhero/oas` test suite.

```
────────────────────────────────── ⋅⋆ Suite ⋆⋅ ─────────────────────────────────


@superhero/oas/headers 
├─ conform 
│  ├─ returns instance as-is if no schema and not required ✔ 2.761ms
│  ├─ throws if required and missing ✔ 2.766ms
│  ├─ returns undefined if not required and instance is missing ✔ 0.410ms
│  ├─ validates schema if present ✔ 2.071ms
│  ├─ throws if schema validation fails ✔ 0.607ms
│  ├─ returns conformed value from schema ✔ 0.453ms
│  ├─ throws if $ref is invalid ✔ 0.713ms
│  └─ ✔ 14.463ms
└─ ✔ 16.205ms

@superhero/oas/parameters 
├─ conform 
│  ├─ conforms a required query parameter with schema ✔ 6.854ms
│  ├─ uses default if missing and defined ✔ 1.100ms
│  ├─ throws if required and missing ✔ 2.280ms
│  ├─ allows null if nullable ✔ 0.980ms
│  ├─ extracts from path and explodes ✔ 1.233ms
│  ├─ extracts from header without explode ✔ 0.448ms
│  ├─ extracts multiple from query with explode ✔ 0.855ms
│  ├─ returns undefined if not required and not present ✔ 0.349ms
│  ├─ throws on unsupported allowReserved ✔ 1.122ms
│  ├─ throws on unsupported style ✔ 0.879ms
│  ├─ throws on invalid $ref target ✔ 0.764ms
│  └─ ✔ 19.886ms
├─ validateComponent 
│  ├─ throws if not array ✔ 0.613ms
│  ├─ an array of parameter objects are not valid ✔ 0.457ms
│  ├─ throws if parameter is not object ✔ 0.461ms
│  ├─ throws if name is missing ✔ 0.330ms
│  ├─ throws if in is missing ✔ 0.280ms
│  ├─ throws if in is invalid ✔ 0.407ms
│  └─ ✔ 3.082ms
└─ ✔ 24.011ms

@superhero/oas/request-bodies 
├─ conform 
│  ├─ conforms valid application/json request body ✔ 9.018ms
│  ├─ throws if content-type does not match ✔ 2.232ms
│  ├─ supports wildcard content type ✔ 0.667ms
│  ├─ throws if matching content-type lacks schema ✔ 2.072ms
│  ├─ throws on invalid $ref ✔ 1.660ms
│  └─ ✔ 23.510ms
├─ validateComponent 
│  ├─ valid component with application/json ✔ 1.492ms
│  ├─ throws if content is not an object ✔ 1.305ms
│  ├─ throws if application/json is missing ✔ 1.037ms
│  ├─ throws if multiple content types defined ✔ 0.784ms
│  ├─ allows $ref only without content ✔ 1.274ms
│  └─ ✔ 6.997ms
└─ ✔ 32.628ms

@superhero/oas/responses 
├─ conform 
│  ├─ sets response body and content-type header from schema ✔ 7.510ms
│  ├─ throws if unsupported content type in content ✔ 1.378ms
│  ├─ does not fail if content has no schema ✔ 0.214ms
│  ├─ sets response headers using header schema ✔ 1.673ms
│  ├─ throws on invalid header schema ✔ 0.427ms
│  ├─ throws if headers is not an object ✔ 0.348ms
│  ├─ passes through if component is a $ref ✔ 1.824ms
│  └─ ✔ 16.422ms
├─ validateRefPointer 
│  ├─ accepts valid pointer ✔ 0.761ms
│  ├─ throws on invalid pointer ✔ 0.688ms
│  └─ ✔ 2.252ms
├─ validateComponentAttributes 
│  ├─ does not throw if an empty response object ✔ 0.538ms
│  ├─ throws if status code is invalid ✔ 0.407ms
│  └─ ✔ 1.372ms
└─ ✔ 23.236ms

@superhero/oas/schemas 
├─ Supported attributes 
│  ├─ type:boolean 
│  │  ├─ nullable enum ✔ 16.992ms
│  │  ├─ throws if invalid enum type ✔ 0.751ms
│  │  ├─ casts strings that can be interpreted as a boolean value to boolean ✔ 1.435ms
│  │  ├─ throws if invalid ✔ 0.487ms
│  │  └─ ✔ 36.326ms
│  ├─ type:integer 
│  │  ├─ nullable enum ✔ 2.087ms
│  │  ├─ minimum ✔ 0.558ms
│  │  ├─ maximum ✔ 0.984ms
│  │  ├─ exclusiveMinimum ✔ 0.760ms
│  │  ├─ exclusiveMaximum ✔ 1.512ms
│  │  ├─ multipleOf ✔ 0.673ms
│  │  ├─ format int32 ✔ 0.512ms
│  │  ├─ format int64 ✔ 0.655ms
│  │  ├─ throws if invalid format ✔ 0.300ms
│  │  ├─ throws if invalid enum type ✔ 0.247ms
│  │  ├─ throws if a decimal ✔ 1.966ms
│  │  └─ ✔ 15.759ms
│  ├─ type:number 
│  │  ├─ nullable enum ✔ 0.896ms
│  │  ├─ format float ✔ 0.459ms
│  │  ├─ format double ✔ 0.631ms
│  │  ├─ throws if invalid enum type ✔ 0.410ms
│  │  ├─ casts strings that can be interpreted as a number value to number ✔ 0.362ms
│  │  └─ ✔ 4.849ms
│  ├─ type:string 
│  │  ├─ nullable enum ✔ 0.385ms
│  │  ├─ minLength ✔ 0.443ms
│  │  ├─ maxLength ✔ 0.764ms
│  │  ├─ pattern ✔ 0.558ms
│  │  ├─ format date ✔ 2.638ms
│  │  ├─ format time ✔ 0.488ms
│  │  ├─ format datetime ✔ 1.144ms
│  │  ├─ format base64 ✔ 1.887ms
│  │  ├─ format email ✔ 0.962ms
│  │  ├─ format ipv4 ✔ 2.326ms
│  │  ├─ format ipv6 ✔ 18.115ms
│  │  ├─ url ✔ 1.079ms
│  │  ├─ format uuid ✔ 0.736ms
│  │  ├─ throws if invalid enum type ✔ 0.342ms
│  │  └─ ✔ 37.579ms
│  ├─ type:null 
│  │  ├─ throws if not null ✔ 0.377ms
│  │  ├─ throws if value is null and type is not null ✔ 0.350ms
│  │  └─ ✔ 1.443ms
│  ├─ type:undefined ✔ 0.217ms
│  ├─ type:array 
│  │  ├─ throws if invalid type ✔ 0.336ms
│  │  ├─ items ✔ 2.480ms
│  │  ├─ minItems ✔ 0.471ms
│  │  ├─ maxItems ✔ 0.691ms
│  │  ├─ uniqueItems ✔ 6.420ms
│  │  ├─ enum ✔ 2.265ms
│  │  ├─ throws if invalid enum type ✔ 0.694ms
│  │  ├─ nullable enum ✔ 1.592ms
│  │  ├─ nullable items ✔ 0.934ms
│  │  ├─ nullable enum items ✔ 0.500ms
│  │  └─ ✔ 20.844ms
│  ├─ type:object 
│  │  ├─ throws if invalid type ✔ 0.599ms
│  │  ├─ additionalProperties ✔ 1.095ms
│  │  ├─ minProperties ✔ 1.666ms
│  │  ├─ maxProperties ✔ 0.705ms
│  │  ├─ propertyNames pattern ✔ 1.120ms
│  │  ├─ nullable ✔ 0.426ms
│  │  ├─ enum ✔ 5.667ms
│  │  ├─ nullable enum ✔ 0.692ms
│  │  ├─ throws if invalid enum type ✔ 0.870ms
│  │  └─ ✔ 18.955ms
│  ├─ type:invalid throws ✔ 0.989ms
│  ├─ readOnly 
│  │  ├─ when is reading ✔ 0.287ms
│  │  ├─ when is writing ✔ 0.332ms
│  │  └─ ✔ 1.544ms
│  ├─ writeOnly 
│  │  ├─ when is reading ✔ 0.411ms
│  │  ├─ when is writing ✔ 0.903ms
│  │  └─ ✔ 2.006ms
│  ├─ default 
│  │  ├─ when no value ✔ 0.537ms
│  │  ├─ when value ✔ 0.295ms
│  │  └─ ✔ 1.560ms
│  ├─ if/then/else 
│  │  ├─ then ✔ 0.461ms
│  │  ├─ else ✔ 0.870ms
│  │  ├─ throws if invalid ✔ 7.204ms
│  │  └─ ✔ 10.017ms
│  ├─ not ✔ 0.781ms
│  ├─ allOf 
│  │  ├─ validates with additional fields ✔ 0.470ms
│  │  ├─ throws if all are not valid ✔ 0.405ms
│  │  └─ ✔ 3.285ms
│  ├─ anyOf 
│  │  ├─ conforms to valid schema ✔ 0.256ms
│  │  ├─ throws if none is valid ✔ 0.262ms
│  │  └─ ✔ 0.963ms
│  ├─ oneOf 
│  │  ├─ conforms to valid schema ✔ 0.324ms
│  │  ├─ throws if none is valid ✔ 0.322ms
│  │  ├─ throws if more than one is valid ✔ 0.211ms
│  │  └─ ✔ 1.430ms
│  ├─ const ✔ 0.505ms
│  ├─ deep const ✔ 0.765ms
│  ├─ throws on invalid $ref ✔ 1.711ms
│  ├─ throws on invalid schema ✔ 3.611ms
│  └─ ✔ 169.413ms
└─ ✔ 171.637ms

@superhero/oas 
├─ should load OpenAPI specification ✔ 79.625ms
├─ can denormalize an operation ✔ 6.683ms
└─ ✔ 88.665ms

@superhero/oas/loader 
├─ merges inline and file-based entries ✔ 2.583ms
├─ fails on unreadable file ✔ 2.574ms
└─ ✔ 14.930ms


──────────────────────────────── ⋅⋆ Coverage ⋆⋅ ────────────────────────────────


Files                                            Coverage   Functions   Branches
╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌
components/abstraction.js                             85%        100%        80%
╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌
components/headers.js                                 84%         80%        94%
╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌
components/headers.test.js                           100%        100%       100%
╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌
components/parameters.js                              92%        100%        88%
╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌
components/parameters.test.js                        100%        100%       100%
╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌
components/request-bodies.js                         100%        100%        96%
╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌
components/request-bodies.test.js                    100%        100%       100%
╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌
components/responses.js                               94%        100%        95%
╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌
components/responses.test.js                         100%        100%       100%
╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌
components/schemas.js                                 97%        100%        95%
╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌
components/schemas.test.js                           100%        100%       100%
╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌
index.js                                              81%        100%        60%
╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌
index.test.js                                        100%        100%       100%
╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌
Total                                                 96%        95%         99%


──────────────────────────────── ⋅⋆ Uncovered ⋆⋅ ───────────────────────────────


─ components/abstraction.js
  [63-69], [110-114], [121-125], [132-136], [145-149]
─ components/headers.js
  [22-31], [60-63]
─ components/parameters.js
  [129-132], [143-146], [150-153]
─ components/responses.js
  [28-35]
─ components/schemas.js
  [57-58], [68-69], [76-77], [338-342], [362-368], [470-475], [480-484]
─ index.js
  [21-26], [49-50], [109-112], [118-119], [124-129], [143-147], [151-155]
  [162-166]

──────────────────────────────────── ⋅• ☀ •⋅ ───────────────────────────────────


[LOCATOR] ⇢ loaded @superhero/oas


───────────────────────────────── ⋅⋆ Summary ⋆⋅ ────────────────────────────────


Suites                                                                        16
╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌
Tests                                                                        141
╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌
Passed                                                                       141
╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌
Failed                                                                         0
╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌
Cancelled                                                                      0
╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌
Skipped                                                                        0
╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌
Todo                                                                           0


────────────────────────────── 2025-06-22 13:49:28 ─────────────────────────────
```

---

## Assert

An extension of the node.js native assert function, with additional assertion methods.

### Comparison Assertions

- _instance:_ The provided contextual input value.
- _expected:_ The provided expected value.
- _message:_ The error message used when the assertion fails.

- **instanceof(...):** Asserts that the provided value is an `instanceof` the expected type.
- **typeof(...):** Asserts that the provided value is `typeof` the expected enum string: `undefined`, `boolean`, `string`, `number`, `bigint`, `object`, `symbol`, `function`.
- **classTag(...):** Asserts that the provided value has the expected class tag, example: `[object Object]`, `[object Array]`, `[object Boolean]`, etc.
- **includes(...):** Asserts that the provided array includes the expected value.
- **greaterThan(...):** Asserts that the provided value is greater than the expected value.
- **greaterThanOrEqual(...):** Asserts that the provided value is greater than or equals to the expected value.
- **lessThan(...):** Asserts that the provided value is less than the expected value.
- **lessThanOrEqual(...):** Asserts that the provided value is less than or equals to the expected value.
- **bitmask(...):** Asserts a bitmask check, or bitwise flag check - it's checking whether all bits set in the mask are also set in the provided value.
- **xor(...):** Asserts the provided value using an exclusive or versus the expected value - one or the other, not both or none, are true.

### Is of Type Assertions

- _instance:_ The provided contextual input value.
- _message:_ The error message used when the assertion fails.

- **isArray(...):** Asserts that the provided value is an `Array`.

### OAS Assertions

All OAS assertion methods has the following argument interface:

- _specification:_ The full OAS specification to be able to follow referenced components.
- _component:_ The component to assert the provided contextual value with.
- _instance:_ The provided contextual input value.
- _message:_ The error message used when the assertion fails.

- **oasHeader(...):** Asserts the provided header using the `@superhero/oas/components/headers`.`conform` method.
- **oasParameter(...):** Asserts the provided parameter using the `@superhero/oas/components/parameters`.`conform` method.
- **oasRequestBody(...):** Asserts the provided request body using the `@superhero/oas/components/requestBodies`.`conform` method.
- **oasResponse(...):** Asserts the provided response body using the `@superhero/oas/components/responses`.`conform` method.
- **oasSchema(...):** Asserts the provided instance using the `@superhero/oas/components/schemas`.`conform` method.

---

## Assert Contextual

A proxy of the `@superhero/audit/assert` module. Provides the ability to add a contextual value to any `AssertionError` that the test fails due to.

### Example

```javascript
import contextualAssert from '@superhero/audit/assert/contextual'
import Request          from '@superhero/http-request'
import { suite, test }  from 'node:test'

suite('example', () =>
{
  const request = new Request({ doNotThrowOnErrorStatus:true, retry:false, timeout: 10e3 })

  test('example test', async () =>
  {
    const
      url       = `http://example.com/foo`,
      body      = { bar: 'baz' },
      response  = await request.post({ url, body }),
      assert    = contextualAssert({ response })

    assert.equal(response.body, 'qux', 'response body should be "qux"')
  })
})
```

### Output

```javascript
AssertionError [ERR_ASSERTION]: '...' == 'qux'
    at TestContext.<anonymous> (file:///.../Workspace/@superhero/audit/example.test.js:17:12)
    at async Test.run (node:internal/test_runner/test:935:9)
    at async Suite.processPendingSubtests (node:internal/test_runner/test:633:7) {
  generatedMessage: true,
  code: 'ERR_ASSERTION',
  actual: '...',
  expected: 'qux',
  operator: '==',
  context: { response: { ... } }
}
```

**OBS!** There is a `context` argument attached to the `Error` with the full response model.

---

## Syntax check

A syntax-check test module that utilizes the `node -c` command through a bash script.

### Example 1

Standalone...

**package.json:**

```json
{
  "name": "app",
  "scripts": {
    "test": "syntax-check"
  },
  "devDependencies": {
    "@superhero/audit": "*"
  }
}
```

### Example 2

Complement test suite...

**package.json:**

```json
{
  "name": "app",
  "scripts": {
    "test": "syntax-check && node --test --test-reporter=@superhero/audit/reporter --experimental-test-coverage"
  },
  "devDependencies": {
    "@superhero/audit": "*"
  }
}
```

### Output

```
Syntax check of files:

✔ ./foo.js
✔ ./lib/bar.js
✔ ./lib/baz.js
✔ ./lib/qux.js

Successful syntax check of 4 files
```