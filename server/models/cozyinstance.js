'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _cozydb = require('cozydb');

var _cozydb2 = _interopRequireDefault(_cozydb);

var Cozy = _cozydb2['default'].getModel('CozyInstance', {
    domain: String,
    helpUrl: String,
    locale: String
});

exports['default'] = Cozy;
module.exports = exports['default'];