'use strict';

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.get_fqdn = get_fqdn;
exports.update_fqdn = update_fqdn;

var _modelsCozyinstance = require('../models/cozyinstance');

var _modelsCozyinstance2 = _interopRequireDefault(_modelsCozyinstance);

var _helpers = require('../helpers');

function get_fqdn(req, res) {
    var cozy, domain;
    return _regeneratorRuntime.async(function get_fqdn$(context$1$0) {
        while (1) switch (context$1$0.prev = context$1$0.next) {
            case 0:
                context$1$0.next = 2;
                return _regeneratorRuntime.awrap(_modelsCozyinstance2['default'].all());

            case 2:
                cozy = context$1$0.sent;
                domain = cozy[0].domain;

                res.send(200, domain);

            case 5:
            case 'end':
                return context$1$0.stop();
        }
    }, null, this);
}

function update_fqdn(req, res) {
    var exec, child, params;
    return _regeneratorRuntime.async(function update_fqdn$(context$1$0) {
        while (1) switch (context$1$0.prev = context$1$0.next) {
            case 0:
                exec = require('child_process').exec;
                params = req.body;

                if (params.fqdn) {
                    context$1$0.next = 4;
                    break;
                }

                return context$1$0.abrupt('return', (0, _helpers.sendErr)(res, "missing parameters", 400, "missing parameters"));

            case 4:

                child = exec('sudo /usr/share/cozy/debian-reconfigure-cozy-domain.sh "' + params.fqdn + '" > /tmp/debian-reconfigure-cozy-domain.txt', function (error, stdout, stderr) {
                    console.log('stdout: ' + stdout);
                    console.log('stderr: ' + stderr);
                    if (error !== null) {
                        console.log('exec error: ' + error);
                    }
                });

                res.send(200, { message: 'I try to configure your cozy with: ' + params.fqdn });

            case 6:
            case 'end':
                return context$1$0.stop();
        }
    }, null, this);
}