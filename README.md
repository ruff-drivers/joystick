[![Build Status](https://travis-ci.org/ruff-drivers/joystick.svg)](https://travis-ci.org/ruff-drivers/joystick)

# PS2 Joystick Driver for Ruff

This is a joystick driver that support joystick device with 2 analog outputs (0~5v) and a digital output.

## Supported Engines

* Ruff: ~1.2.0

## Supported Models

- [joystick-9p](https://rap.ruff.io/devices/joystick-9p)
- [joystick-5p](https://rap.ruff.io/devices/joystick-5p)

## Installing

Execute following command and enter a **supported model** to install.

```sh
# Please replace `<device-id>` with a proper ID.
# And this will be what you are going to query while `$('#<device-id>')`.
rap device add <device-id>

# Then enter a supported model, for example:
# ? model: joystick-9p
# ? value (number) for argument "interval": (50)
# ? value (number) for argument "accuracy": (0.1)
```

### Arguments

#### `interval`

The interval (in millisenconds) of x/y axis value updating, defaults to `50`.

#### `accuracy`

The accuracy of x/y axis value, defaults to `0.1`. It should be a number that `>0` and `<=1`.

## Usage

Here is the basic usage of this driver.

```js
'use strict';

var joystick = $('#<device-id>');

joystick.on('push', function () {
    console.log('push');
});

joystick.on('release', function () {
    console.log('release');
});

joystick.on('x', function (x) {
    console.log('x changed', x);
});

joystick.on('y', function (y) {
    console.log('y changed', y);
});

joystick.on('change', function (change) {
    if ('x' in change) {
        console.log('x changed', change.x);
    }

    if ('y' in change) {
        console.log('y changed', change.y);
    }
});

joystick.x; // value of last updated x.
joystick.y; // value of last updated y.
```

The driver will do a calibration when the device is loaded.
If you want manual calibration, please use `calibrate()` method.

## API References

### Methods

#### `calibrate(callback)`

Calibrate the middle voltage values of axises x and y to current voltages.

- **callback:** The callback that takes the first argument as the possible error.

### Properties

#### `x`

Value of last updated value of axis x, ranges from `-1` to `1`.

#### `y`

Value of last updated value of axis y, ranges from `-1` to `1`.

### Events

#### `push`

Emits when the key is pushed.

#### `release`

Emits when the key is released.

#### `x`

Emits when value of axis x is changed, with the value as the first event argument.

#### `y`

Emits when value of axis y is changed, with the value as the first event argument.

#### `change`

Emits when either or both of the values of two axes are changed,
with a `change` object as the first event argument.

The `change` object has property `x` if value of axis x is changed,
and has property `y` if value of axis y is changed.

For example, if both of the x and y axes get changed, the `change` object would look like:

```json
{
    "x": 0.5,
    "y": -0.2
}
```

## Contributing

Contributions to this project are warmly welcome. But before you open a pull request, please make sure your changes are passing code linting and tests.

You will need the latest [Ruff SDK](https://ruff.io/) to install rap dependencies and then to run tests.

### Installing Dependencies

```sh
npm install
rap install
```

### Running Tests

```sh
npm test
```

## License

The MIT License (MIT)

Copyright (c) 2016 Nanchao Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
