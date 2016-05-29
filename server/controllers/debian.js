const fs = require('fs');
const CozyInstance = require('../models/cozyinstance');

var scriptsList;

scriptsHelpers = require('../helpers/scripts');

var executeCommand = function (command, callback) {
    var exec = require('child_process').exec,
        child;

	console.log(command);
	child = exec(command, function (error, stdout, stderr) {
		console.log('stdout: ' + stdout);
		console.log('stderr: ' + stderr);
		if (error !== null) {
			console.log('exec error: ' + error);
			callback(error);
		} else {
			callback(null);
		}
	});
};

module.exports.run_controls = (req, res) => {

	var errMessage = "Oops, it looks like the app is not correctly installed : <br />";
	var okMessage = "Good, all scripts are installed.";

	try {
		scriptsList = scriptsHelpers.updateScriptsListFromConfig();
		console.log(scriptsList);
		console.log("scripts updated !");
	}
	catch (err) {
			console.log("updateScriptsListFromConfig:error:", err);
			errMessage += err + "<br />";
	}

	scriptsHelpers.checkAllScriptsExist(function (err, status) {
		console.log("checkAllScriptsExist:status:", status);
		if (err || status !== 100) {
			for (var i=0; i<err.length; i++) {
				errMessage += err[i] + "<br />";
			}
			res.status(500).send({ message: errMessage });
		} else {
			res.status(200).send({ message: okMessage });
		}
	});
};

module.exports.get_fqdn = (req, res) => {

	// Get domain in CouchDB
	CozyInstance.all((err, results) => {
		if (err) {
			console.log("module.exports.get_fqdn:ERR:", err);
			res.status(500).send({ message: "Unable to get the current FQDN" });
		} else {
			//console.log("module.exports.get_fqdn:results:", results);
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
    const params = req.body;

    var scriptName = scriptsList['reconfigure_script'];

    // Check if fqdn param exist & return an error if not
    if (!params.fqdn) {
        res.status(400).send({ message: "missing parameters" });
    } else {

		// Exec reconfigure of package
		var reconfigure_command = 'sudo ' + scriptName + ' "' + params.fqdn + '" > /tmp/debian-reconfigure-cozy-domain.txt';

		executeCommand (reconfigure_command, function (err) {
			if (!err) {
				res.status(200).send({ message: 'Reconfiguring your cozy with: ' + params.fqdn });
			} else {
				res.status(500).send({ message: 'ERROR: ' + err });
			}
		});

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

		var scriptName = scriptsList['halt_script'];

		var halt_command = 'sudo ' + scriptName + ' > /dev/null';

		executeCommand (halt_command, function (err) {
			if (!err) {
				res.status(200).send({ message: 'This host has been halted !' });
			} else {
				res.status(500).send({ message: 'ERROR: ' + err });
			}
		});

    } else {
        res.status(500).send({ message: 'This host is not self-hosted, could not shut it down !' });
    }
};

module.exports.host_reboot = (req, res) => {
    // reboot the host

    var isVPS = process.env.MANAGED;

    if (typeof isVPS === 'undefined' || isVPS === false) {

		var scriptName = scriptsList['reboot_script'];

		var reboot_command = 'sudo ' + scriptName + ' > /dev/null';

		executeCommand (reboot_command, function (err) {
			if (!err) {
				res.status(200).send({ message: 'This host is rebooting, it could take a few minutes !' });
			} else {
				res.status(500).send({ message: 'ERROR: ' + err });
			}
		});

    } else {
        res.status(500).send({ message: 'This host is not self-hosted, could not reboot it !' });
    }
};

module.exports.database_maintenance = (req, res) => {
    console.log("database_maintenance:option:" + req.params.option);
    var database_command = "sudo ";
    var okMessage = "";

	var scriptName = scriptsList['database_script'];

	database_command += scriptName;

	if (typeof req.params.option !== 'undefined') {
		switch (req.params.option) {
			case "compact":
				database_command += " compact";
				okMessage = "Database has been compacted successfully !";
				break;
			case "views":
				database_command += " views";
				okMessage = "Database views have been compacted successfully !";
				break;
			case "cleanup":
				database_command += " cleanup";
				okMessage = "Database has been cleaned up successfully !";
				break;
			default:
				res.status(500).send({ message: 'Error : unknown database option "' + req.params.option + '"' });
		};
	}

	executeCommand (database_command, function (err) {
		if (!err) {
			res.status(200).send({ message: okMessage });
		} else {
			res.status(500).send({ message: 'Error while executing database maintenance operation : ' + err });
		}
	});

};