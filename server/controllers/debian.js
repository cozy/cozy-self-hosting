import CozyInstance from '../models/cozyinstance';

module.exports.get_fqdn = (req, res) => {
    // Get domain in CouchDB
    CozyInstance.all((err, results) => {
        const domain = results[0].domain;

        res.status(200).send(domain);
    });
}

module.exports.update_fqdn = (req, res) => {
    // Get FQDN from user to configure cozy Debian Package
    var exec = require('child_process').exec, child;
    const params = req.body;


    // Check if fqdn param exist & return an error if not
    if (!params.fqdn) {

        res.status(400).send({message: "missing parameters"});
    } else {
        // Exec reconfigure of package
        // child = exec('sudo /usr/share/cozy/debian-reconfigure-cozy-domain.sh "' + params.fqdn + '" > /tmp/debian-reconfigure-cozy-domain.txt',
        child = exec('sudo /tmp/debian-reconfigure-cozy-domain.sh "' + params.fqdn + '" > /tmp/debian-reconfigure-cozy-domain.txt',
                     function (error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error !== null) {
                console.log('exec error: ' + error);
            }
        });

        res.status(200).send({message: 'I reconfigure your cozy with: ' + params.fqdn});
    }
}
