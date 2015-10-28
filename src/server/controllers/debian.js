import {sendErr, asyncErr}      from '../helpers';

module.exports.fqdn = function (req, res) {
    let params = req.body;

    if (!params.fqdn)
        return sendErr(res, "missing parameters", 400, "missing parameters");

    res.send(200, {message: 'I try to configure your cozy with: ' + params.fqdn});
};
