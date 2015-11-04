import Cozy          from '../models/cozyinstance';

import {sendErr, asyncErr}      from '../helpers';

export async function get_fqdn(req, res) {
    let cozy = await Cozy.all();
    let domain = cozy[0].domain;

    res.send(200, domain);
}

export async function update_fqdn(req, res) {
    var exec = require('child_process').exec, child;
    let params = req.body;

    if (!params.fqdn)
        return sendErr(res, "missing parameters", 400, "missing parameters");

    child = exec('sudo /usr/share/cozy/debian-reconfigure-cozy-domain.sh "' + params.fqdn + '" > /tmp/debian-reconfigure-cozy-domain.txt',
                 function (error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) {
            console.log('exec error: ' + error);
        }
    });

    res.send(200, {message: 'I try to configure your cozy with: ' + params.fqdn});
}
