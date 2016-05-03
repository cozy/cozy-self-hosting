const fs = require('fs');
const CozyInstance = require('../models/cozyinstance');

module.exports.get_fqdn = (req, res) => {
    // Get domain in CouchDB
    CozyInstance.all((err, results) => {
        if (err) {
            console.log("module.exports.get_fqdn:ERR:", err);
            res.status(500).send({ message: "Unable to get the current FQDN" });
        } else {
            console.log("module.exports.get_fqdn:results:", results);
            if (typeof results !== 'undefined') {
                const domain = results[0].domain;
                console.log("module.exports.get_fqdn:OK:", domain);
                if (typeof results !== 'undefined') {
                    res.status(200).send(domain);
                } else {
                    res.status(500).send({ message: "Unable to get the current FQDN : cozy domain is undefined" });
                }
            } else {
                console.log("module.exports.get_fqdn:ERR:error");
                res.status(500).send({ message: "Unable to get the current FQDN" });
            }
        }
    });
};

module.exports.update_fqdn = (req, res) => {
    // Get FQDN from user to configure cozy Debian Package
    var exec = require('child_process').exec,
        child;

    const params = req.body;
    const config_filename = '/etc/cozy/self-hosting.json';
    var reconfigure_script = '/usr/share/cozy/debian-reconfigure-cozy-domain.sh';

    // Try to load config from reconfigure_script
    try {
        const config = require(config_filename);
        reconfigure_script = config.reconfigure_script;
        console.log('Config filename: ' + config_filename);
    } catch (e) {
        console.log('Missing config filename: ' + config_filename);
    }
    console.log('Reconfigure script: ' + reconfigure_script);

    // Check if fqdn param exist & return an error if not
    if (!params.fqdn) {

        res.status(400).send({ message: "missing parameters" });
    } else {
        // Exec reconfigure of package
        var reconfigure_command = 'sudo ' + reconfigure_script + ' "' + params.fqdn + '" > /tmp/debian-reconfigure-cozy-domain.txt';
        console.log(reconfigure_command);
        child = exec(reconfigure_command, function (error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error !== null) {
                console.log('exec error: ' + error);
            }
        });

        res.status(200).send({ message: 'I reconfigure your cozy with: ' + params.fqdn });
    }
};

module.exports.host_halt = (req, res) => {
    // halt the host

    var exec = require('child_process').exec,
        child;

    const config_filename = '/etc/cozy/self-hosting.json';
    var halt_script = '/usr/local/sbin/debian-halt.sh';

    // Try to load config from config file
    try {
        const config = require(config_filename);
        halt_script = config.halt_script;
        console.log('Config filename: ' + config_filename);
    } catch (e) {
        console.log('Missing config filename: ' + config_filename);
    }
    console.log('Reconfigure script: ' + halt_script);

    var halt_command = 'sudo ' + halt_script + ' halt > /dev/null';
    console.log("module.exports.host_halt:", halt_command);
    child = exec(halt_command, function (error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) {
            console.log('exec error: ' + error);
        }
    });

    res.status(200).send({ message: 'This host has been halted !' });
};

module.exports.host_reboot = (req, res) => {
    // reboot the host

    var exec = require('child_process').exec,
        child;

    const config_filename = '/etc/cozy/self-hosting.json';
    var halt_script = '/usr/local/sbin/debian-halt.sh';

    // Try to load config from config file
    try {
        const config = require(config_filename);
        halt_script = config.halt_script;
        console.log('Config filename: ' + config_filename);
    } catch (e) {
        console.log('Missing config filename: ' + config_filename);
    }
    console.log('Reconfigure script: ' + halt_script);

    var halt_command = 'sudo ' + halt_script + ' reboot > /dev/null';
    console.log("module.exports.host_halt:", halt_command);

    child = exec(reboot_command, function (error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) {
            console.log('exec error: ' + error);
        }
    });

    res.status(200).send({ message: 'This host has been rebooted !' });
};