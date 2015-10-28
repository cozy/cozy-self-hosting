"use strict";

var _helpers = require('../helpers');

module.exports.fqdn = function (req, res) {
    var params = req.body;

    if (!params.fqdn) return (0, _helpers.sendErr)(res, "missing parameters", 400, "missing parameters");

    res.send(200, { message: 'I try to configure your cozy with: ' + params.fqdn });
};