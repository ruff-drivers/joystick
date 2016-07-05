/*!
 * Copyright (c) 2016 Nanchao Inc.
 * All rights reserved.
 */

'use strict';

var driver = require('ruff-driver');
var util = require('util');

var MAX_VOLTAGE = 5;

var KeyState = {
    pushed: 0,
    released: 1
};

var prototype = {
    _setupTimer: function () {
        clearInterval(this._timer);
        this._timer = setInterval(this._readHandler, this._interval);
    },
    _readHandler: function () {
        var that = this;

        parallel(this._getVoltageHandlers, function (error, values) {
            if (error) {
                that.emit('error', error);
                return;
            }

            var x = round(voltageToValue(values[0], that._middleVoltageX), that._accuracy);
            var y = round(voltageToValue(values[1], that._middleVoltageY), that._accuracy);

            var xChanged = false;
            var yChanged = false;

            if (x !== that._x) {
                that._x = x;
                that.emit('x', x);
                xChanged = true;
            }

            if (y !== that._y) {
                that._y = y;
                that.emit('y', y);
                yChanged = true;
            }

            if (xChanged || yChanged) {
                var change = {};

                if (xChanged) {
                    change.x = x;
                }

                if (yChanged) {
                    change.y = y;
                }

                that.emit('change', change);
            }
        });
    },
    calibrate: function (callback) {
        var that = this;

        parallel(this._getVoltageHandlers, function (error, values) {
            if (error) {
                util.invokeCallback(callback, error);
                return;
            }

            that._middleVoltageX = values[0];
            that._middleVoltageY = values[1];

            util.invokeCallback(callback);
        });
    }
};

Object.defineProperties(prototype, {
    x: {
        get: function () {
            return this._x;
        }
    },
    y: {
        get: function () {
            return this._y;
        }
    }
});

function voltageToValue(voltage, middleVoltage) {
    return voltage > middleVoltage ?
        (voltage - middleVoltage) / (MAX_VOLTAGE - middleVoltage) :
        voltage / middleVoltage - 1;
}

function round(value, accuracy) {
    return Math.round(value / accuracy) * accuracy;
}

module.exports = driver({
    attach: function (inputs, context, callback) {
        var that = this;

        this._key = inputs['key'];
        this._adcX = inputs['x'];
        this._adcY = inputs['y'];

        this._keyState = KeyState.released;

        this._key.on('interrupt', function (level) {
            var state = level ? KeyState.released : KeyState.pushed;

            if (state === that._keyState) {
                return;
            }

            that.emit(state === KeyState.pushed ? 'push' : 'release');
            that._keyState = state;
        });

        var args = context.args;

        this._interval = args.interval || 50;
        this._accuracy = args.accuracy || 0.1;

        this._middleVoltageX = MAX_VOLTAGE / 2;
        this._middleVoltageY = MAX_VOLTAGE / 2;

        this._getVoltageHandlers = [
            this._adcX.getVoltage.bind(this._adcX),
            this._adcY.getVoltage.bind(this._adcY)
        ];

        this._readHandler = this._readHandler.bind(this);

        this.calibrate(function (error) {
            if (error) {
                callback(error);
                return;
            }

            that._setupTimer();
            callback();
        });
    },
    exports: prototype
});

function parallel(tasks, callback) {
    var done = false;
    var pending = tasks.length;
    var results = [];

    tasks.forEach(function (task, index) {
        task(function (error, value) {
            if (error) {
                done = true;
                callback(error);
                return;
            }

            if (done || index in results) {
                return;
            }

            results[index] = value;

            if (--pending) {
                return;
            }

            done = true;
            callback(undefined, results);
        });
    });
}
