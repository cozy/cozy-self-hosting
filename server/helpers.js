'use strict';

var _Promise = require('babel-runtime/core-js/promise')['default'];

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.sendErr = sendErr;
exports.asyncErr = asyncErr;
exports.promisify = promisify;
exports.promisifyModel = promisifyModel;
var log = require('printit')({
    prefix: 'http-error',
    date: true
});

function sendErr(res, context, statusCode, userMessage, code) {
    if (statusCode === undefined) statusCode = 500;
    if (userMessage === undefined) userMessage = "Internal server error.";

    log.error('Error: ' + context + ' - ' + userMessage);
    res.status(statusCode).send({
        code: code,
        error: userMessage
    });
    return false;
}

function asyncErr(res, err, context) {
    var logMessage = context + ': ' + err.toString();

    var statusCode = err.status;
    if (!statusCode) {
        log.warn("no status in asyncErr\n" + new Error().stack);
        statusCode = 500;
    }

    var errorMessage = err.message;
    if (!errorMessage) {
        log.warn("no error message in asyncErr\n" + new Error().stack);
        errorMessage = "Internal server error";
    }

    var errorCode = err.code;

    var userMessage = (context ? context + ': ' : '') + errorMessage;
    return sendErr(res, logMessage, statusCode, userMessage, errorCode);
}

// Transforms a function of the form (arg1, arg2, ..., argN, callback) into a
// Promise-based function (arg1, arg2, ..., argN) that will resolve with the
// results of the callback if there's no error, or reject if there's any error.
// XXX How to make sure the function hasn't been passed to promisify once
// already?

function promisify(func) {
    return function () {
        var _this = this;

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        // Note: "this" is extracted from this scope.
        return new _Promise(function (accept, reject) {
            // Add the callback function to the list of args
            args.push(function (err) {
                for (var _len2 = arguments.length, rest = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                    rest[_key2 - 1] = arguments[_key2];
                }

                if (typeof err !== 'undefined' && err !== null) {
                    reject(err);
                    return;
                }

                if (rest.length === 1) accept(rest[0]);else accept.apply(undefined, rest);
            });
            // Call the callback-based function
            func.apply(_this, args);
        });
    };
}

// Promisifies a few cozy-db methods by default

function promisifyModel(model) {
    var _arr = ['exists', 'find', 'create', 'save', 'updateAttributes', 'destroy', 'all'];

    for (var _i = 0; _i < _arr.length; _i++) {
        var _name = _arr[_i];
        var former = model[_name];
        model[_name] = promisify(former.bind(model));
    }

    var _arr2 = ['save', 'updateAttributes', 'destroy'];
    for (var _i2 = 0; _i2 < _arr2.length; _i2++) {
        var _name2 = _arr2[_i2];
        var former = model.prototype[_name2];
        model.prototype[_name2] = promisify(former);
    }

    return model;
}