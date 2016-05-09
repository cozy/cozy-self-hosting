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
                if (typeof domain !== 'undefined') {
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
    var reconfigure_script = '/usr/local/sbin/debian-reconfigure-cozy-domain.sh';

    // Try to load config from reconfigure_script
    try {
        const config = require(config_filename);
        if (typeof config.reconfigure_script !== 'undefined') {
            reconfigure_script = config.reconfigure_script;
        }
        console.log('Config filename: ' + config_filename);
    } catch (e) {
        console.log('Missing config filename: ' + config_filename + ' or "reconfigure_script" parameter is not defined.');
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

module.exports.is_vps = (req, res) => {
    var isVPS = process.env.MANAGED;

    if (typeof isVPS === 'undefined' || isVPS === false) {
        console.log('is_vps: false');
        res.status(200).send({ isVPS: false });
    } else {
        console.log('is_vps: true');
        res.status(200).send({ isVPS: true });
    }
};

module.exports.host_halt = (req, res) => {
    // halt the host

    var isVPS = process.env.MANAGED;

    if (typeof isVPS === 'undefined' || isVPS === false) {
        var exec = require('child_process').exec,
            child;

        const config_filename = '/etc/cozy/self-hosting.json';
        var halt_script = '/usr/local/sbin/debian-halt.sh';

        // Try to load config from config file
        try {
            const config = require(config_filename);
            if (typeof config.halt_script !== 'undefined') {
                halt_script = config.halt_script;
            }
            console.log('Config filename: ' + config_filename);
        } catch (e) {
            console.log('Missing config filename: ' + config_filename + ' or "halt_script" parameter is not defined.');
        }
        console.log('Reconfigure script: ' + halt_script);

        var halt_command = 'sudo ' + halt_script + ' > /dev/null';
        console.log("module.exports.host_halt:", halt_command);
        child = exec(halt_command, function (error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error !== null) {
                console.log('exec error: ' + error);
            }
        });
        res.status(200).send({ message: 'This host has been halted !' });
    } else {
        res.status(500).send({ message: 'This host is not self-hosted, could not shut it down !' });
    }
};

module.exports.host_reboot = (req, res) => {
    // reboot the host

    var isVPS = process.env.MANAGED;

    if (typeof isVPS === 'undefined' || isVPS === false) {

        var exec = require('child_process').exec,
            child;

        const config_filename = '/etc/cozy/self-hosting.json';
        var reboot_script = '/usr/local/sbin/debian-reboot.sh';

        // Try to load config from config file
        try {
            const config = require(config_filename);
            if (typeof config.reboot_script !== 'undefined') {
                reboot_script = config.reboot_script;
            }
            console.log('Config filename: ' + config_filename);
        } catch (e) {
            console.log('Missing config filename: ' + config_filename + ' or "reboot_script" parameter is not defined.');
        }
        console.log('Reconfigure script: ' + reboot_script);

        var reboot_command = 'sudo ' + reboot_script + ' > /dev/null';
        console.log("module.exports.host_reboot:", reboot_command);

        child = exec(reboot_command, function (error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error !== null) {
                console.log('exec error: ' + error);
            }
        });

        res.status(200).send({ message: 'This host has been rebooted !' });
    } else {
        res.status(500).send({ message: 'This host is not self-hosted, could not reboot it !' });
    }
};