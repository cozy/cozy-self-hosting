import Cozy          from '../models/cozyinstance';

import {sendErr, asyncErr}      from '../helpers';

module.exports.get_fqdn = async function (req, res) {
    let ret = {};
    let domain = '';
    
    ret.cozy = await Cozy.all();
    domain = ret.cozy[0].domain;

    res.send(200, domain);
};

module.exports.update_fqdn = function (req, res) {
    let params = req.body;

    if (!params.fqdn)
        return sendErr(res, "missing parameters", 400, "missing parameters");

    res.send(200, {message: 'I try to configure your cozy with: ' + params.fqdn});
};
