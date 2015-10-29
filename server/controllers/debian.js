'use strict';

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _modelsCozyinstance = require('../models/cozyinstance');

var _modelsCozyinstance2 = _interopRequireDefault(_modelsCozyinstance);

var _helpers = require('../helpers');

module.exports.get_fqdn = function callee$0$0(req, res) {
    var ret, domain;
    return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
        while (1) switch (context$1$0.prev = context$1$0.next) {
            case 0:
                ret = {};
                domain = '';
                context$1$0.next = 4;
                return _regeneratorRuntime.awrap(_modelsCozyinstance2['default'].all());

            case 4:
                ret.cozy = context$1$0.sent;

                domain = ret.cozy[0].domain;

                res.send(200, domain);

            case 7:
            case 'end':
                return context$1$0.stop();
        }
    }, null, this);
};

module.exports.update_fqdn = function (req, res) {
    var params = req.body;

    if (!params.fqdn) return (0, _helpers.sendErr)(res, "missing parameters", 400, "missing parameters");

    res.send(200, { message: 'I try to configure your cozy with: ' + params.fqdn });
};