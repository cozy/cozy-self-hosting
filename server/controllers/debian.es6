import CozyInstance from '../models/cozyinstance';

module.exports.get_fqdn = (req, res) => {
    // Get domain in CouchDB
    CozyInstance.all((err, results) => {
        const domain = results[0].domain;

        res.status(200).send(domain);
    });
};

module.exports.update_fqdn = (req, res) => {
    // Get FQDN from user to configure cozy Debian Package
    const fs = require('fs');
    var exec = require('child_process').exec, child;
    const params = req.body;
    const config_filename = '/etc/cozy/self-hosting.json';
    var reconfigure_script = '/usr/share/cozy/debian-reconfigure-cozy-domain.sh';

    try {
        fs.accessSync(config_filename, fs.F_OK);
        console.log('Config filename: ' + config_filename);
        const config = require(config_filename);
        reconfigure_script = config.reconfigure_script;
    } catch (e) {
        console.log('Missing config filename: ' + config_filename);
    }
    console.log('Reconfigure script: ' + reconfigure_script);


    // Check if fqdn param exist & return an error if not
    if (!params.fqdn) {

        res.status(400).send({message: "missing parameters"});
    } else {
        // Exec reconfigure of package
        child = exec('sudo ' + reconfigure_script + ' "' + params.fqdn + '" > /tmp/debian-reconfigure-cozy-domain.txt',
                     function (error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error !== null) {
                console.log('exec error: ' + error);
            }
        });

        res.status(200).send({message: 'I reconfigure your cozy with: ' + params.fqdn});
    }
};
