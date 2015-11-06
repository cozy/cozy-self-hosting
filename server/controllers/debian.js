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
    // Get domain in CouchDB
    _modelsCozyinstance2['default'].all(function (err, results) {
        var domain = results[0].domain;

        res.status(200).send(domain);
    });
}

function update_fqdn(req, res) {
    // Get FQDN from user to configure cozy Debian Package
    var exec = require('child_process').exec,
        child;
    var params = req.body;

    // Check if fqdn param exist & return an error if not
    if (!params.fqdn) {

        res.status(400).send({ message: "missing parameters" });
    } else {
        // Exec reconfigure of package
        child = exec('sudo /usr/local/sbin/debian-reconfigure-cozy-domain.sh "' + params.fqdn + '" > /tmp/debian-reconfigure-cozy-domain.txt', function (error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error !== null) {
                console.log('exec error: ' + error);
            }
        });

        res.status(200).send({ message: 'I reconfigure your cozy with: ' + params.fqdn });
    }
}