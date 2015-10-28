'use strict';

var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard')['default'];

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _cozydb = require('cozydb');

var americano = _interopRequireWildcard(_cozydb);

var _helpers = require('../helpers');

var Cozy = americano.getModel('CozyInstance', {
    domain: String,
    helpUrl: String,
    locale: String
});

Cozy = (0, _helpers.promisifyModel)(Cozy);

exports['default'] = Cozy;
module.exports = exports['default'];