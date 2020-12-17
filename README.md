# babel-plugin-function-try-actch



## Example

**In**

```js
// input code
```

**Out**

```js
"use strict";

// output code
```

## Installation

```sh
$ npm install babel-plugin-function-try-actch
```

## Usage

### Via `.babelrc` (Recommended)

**.babelrc**

```json
{
  "plugins": ["function-try-actch"]
}
```

### Via CLI

```sh
$ babel --plugins function-try-actch script.js
```

### Via Node API

```javascript
require("babel-core").transform("code", {
  plugins: ["function-try-actch"]
});
```
