'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.get_fqdn = get_fqdn;
exports.update_fqdn = update_fqdn;

var _modelsCozyinstance = require('../models/cozyinstance');

var _modelsCozyinstance2 = _interopRequireDefault(_modelsCozyinstance);

function get_fqdn(req, res) {
    _modelsCozyinstance2['default'].all(function (err, results) {
        var domain = results[0].domain;

        res.status(200).send(domain);
    });
}

function update_fqdn(req, res) {
    var exec = require('child_process').exec,
        child;
    var params = req.body;

    if (!params.fqdn) return sendErr(res, "missing parameters", 400, "missing parameters");

    child = exec('sudo /usr/share/cozy/debian-reconfigure-cozy-domain.sh "' + params.fqdn + '" > /tmp/debian-reconfigure-cozy-domain.txt', function (error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) {
            console.log('exec error: ' + error);
        }
    });

    res.status(200).send({ message: 'I try to configure your cozy with: ' + params.fqdn });
}