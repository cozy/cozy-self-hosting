import CozyInstance from '../models/cozyinstance';

export function get_fqdn(req, res) {
    CozyInstance.all((err, results) => {
        const domain = results[0].domain;

        res.status(200).send(domain);
    });
}

export function update_fqdn(req, res) {
    var exec = require('child_process').exec, child;
    let params = req.body;

    if (!params.fqdn)
        return sendErr(res, "missing parameters", 400, "missing parameters");

    child = exec('sudo /usr/local/sbin/debian-reconfigure-cozy-domain.sh "' + params.fqdn + '" > /tmp/debian-reconfigure-cozy-domain.txt',
                 function (error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) {
            console.log('exec error: ' + error);
        }
    });

    res.status(200).send({message: 'I try to configure your cozy with: ' + params.fqdn});
}
