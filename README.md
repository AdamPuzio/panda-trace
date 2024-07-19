# Trace

`@panda/trace` is a super basic development logger for quick and convenient debugging of your app.

It can be used either statically or as a fully instantiated class, with an array of options available to customize your experience, such as log level and tags.

Trace isn't meant to be a replacement to the bigger logging frameworks out there. It's meant to be a quick, lightweight alternative for debugging and highlighting specific areas and flows of your code during the development process. It's turned off by default, so you must explicitly turn it on to use it.

Features:

* Lightweight, **zero-dependency** library
* Can be run statically or by creating a new instance
* Various, scaling log levels
* Tag and label your logs for custom display filtering

## Installation

```bash
npm i @panda/trace
```

## Setup

```js
// ESM
import Trace from '@panda/trace'

// CommonJS
const Trace = require('@panda/trace')
```

## Usage

### Running Your Script

Trace is turned off by default. To active it, you must use the `TRACE` environmental variable in your terminal.

Values can be `on` or a mixture of `*`, log level and tag(s) separated by a colon (`:`):

```bash
# run script with trace on
TRACE=on node myscript.js

# run script with trace on at debug level
TRACE=debug node myscript.js

# run script with trace on and filtering tags
TRACE=mytag node myscript.js
TRACE=mytag:another.tag node myscript.js

# run script with trace on at warn level and filtering tags
TRACE=warn:mytag:another.tag:third.tag.base node myscript.js
```

### Using Dot Notation

When using dot notation in your tags, you can choose as high or low in the notation hierarchy as you'd like. For instance, `super.sub` will output logs that have `super.sub.foo` and `super.sub.bar.one` as well. This allows you to really target specific functionality without having to write more logs. 

### Add To Code

Use Trace in your file either by calling the `Trace` class' static methods OR by creating a new instance of it:

```js
// static
Trace.debug('message')

// custom
const tracer = new Trace()
tracer.debug('message')
```

The method called matches the log level, so if you're running the above in a script, you'd need to run at least `TRACE=debug` as environmental variables in order for those logs to show.

Adding tags and a label is easy:

```js
// static
Trace.info('message', ['tag'], 'label')

// custom
const tracer = new Trace('MyLabel')
tracer.info('my message', ['MyLabel.subtag']) // we don't need to apply a label bc we've set it in the creation
```

## API

### Logging Output Methods

There are 6 basic log levels:

* `log`
* `error`
* `warn`
* `info`
* `debug`
* `trace`

Each ouput method allows the following parameters:

| param | type   | description |
| ----- | ------ | ----------- |
| msg   | any    | The message to output |
| tags  | array  | The list of tags to apply |
| label | string | The label to apply |

#### `log`

```js
// static
Trace.log('message', ['tag'], 'label')

// instance
tracer.log('message', ['tag']) // uses label from instance
tracer.log('message', ['tag'], 'label') // overrides label from instance
```

#### `error`

```js
// static
Trace.error('message', ['tag'], 'label')

// instance
tracer.error('message', ['tag']) // uses label from instance
tracer.error('message', ['tag'], 'label') // overrides label from instance
```

#### `warn`

```js
// static
Trace.warn('message', ['tag'], 'label')

// instance
tracer.warn('message', ['tag']) // uses label from instance
tracer.warn('message', ['tag'], 'label') // overrides label from instance
```

#### `info`

```js
// static
Trace.info('message', ['tag'], 'label')

// instance
tracer.info('message', ['tag']) // uses label from instance
tracer.info('message', ['tag'], 'label') // overrides label from instance
```

#### `debug`

```js
// static
Trace.debug('message', ['tag'], 'label')

// instance
tracer.debug('message', ['tag']) // uses label from instance
tracer.debug('message', ['tag'], 'label') // overrides label from instance
```

#### `trace`

```js
// static
Trace.trace('message', ['tag'], 'label')

// instance
tracer.trace('message', ['tag']) // uses label from instance
tracer.trace('message', ['tag'], 'label') // overrides label from instance
```

### Additional Methods

#### `out`

| param      | type   | description |
| ---------- | ------ | ----------- |
| msg        | any    | The message to output |
| opts       | object | Options object |
| opts.label | string | The label to apply |
| opts.tags  | array  | The list of tags to apply |
| opts.level | string | The level to output at |
| cfg        | object | Configuration object |

```js
// static
Trace.out('message', { label: 'Foo', tags: ['foo.bar'], level: 'warn' }, { on: true })

// instance
tracer.out('message', { tags: ['foo.bar'], level: 'warn' })
```

#### `clone`

Creates a new instance of `Trace` from the current instance.

#### `configure`

| property | type   | default | description |
| -------- | ------ | ------- | ----------- |
| cfg      | object | `{}`    | Configuration object |

```js
const tracer = new Tracer()
tracer.configure({})
```

##### Options

| option         | type    | default | description |
| -------------- | ------- | ------- | ----------- |
| `on`           | boolean | `false` | Turn logging on |
| `tags`         | array   | `[]`    | Tags to log |
| `all`          | boolean | `true`  | Log all tags (automatically set) |
| `level`        | string  | `info`  | Max level to log (`error/warn/info/debug/trace`) |
| `colorMessage` | boolean | `true`  | String messages are colored the same as their level |

```js
// set to 'on' with a level of 'trace'
const logger = new Trace('Basic', { on: true, level: 'trace' })
// same as
const logger = new Trace('Basic')
logger.configure({ on: true, level: 'trace' })
```
