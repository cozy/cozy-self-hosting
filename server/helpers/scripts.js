const fs = require('fs');

const config_filename = '/etc/cozy/self-hosting.json';
//const config_filename = 'c:\\temp\\self-hosting.json';

// default scripts list
var defaultScriptsList = {
	reconfigure_script: '/usr/local/sbin/debian-reconfigure-cozy-domain.sh',
	halt_script: '/usr/local/sbin/debian-halt.sh',
	reboot_script: '/usr/local/sbin/debian-reboot.sh',
	database_script: '/usr/local/sbin/debian-database-maintenance.sh'
};

var scriptsList = defaultScriptsList;

module.exports.updateScriptsListFromConfig = function() {
	var scriptsKeys = Object.keys(scriptsList);
	console.log('updateScriptsListFromConfig:Config filename: ', config_filename);
	//console.log("updateScriptsListFromConfig:before updating with config_filename:", scriptsList);

	// check script existence
	try {
		fs.accessSync(config_filename, fs.R_OK);
		// config file is present, proceed to update scripts list
		const config = require(config_filename);

		for (var i=0; i<scriptsKeys.length; i++) {
			/*
			console.log("updateScriptsListFromConfig:scriptsKeys[i]:",scriptsKeys[i]) ;
			console.log("updateScriptsListFromConfig:scriptsList[scriptsKeys[i]]:",scriptsList[scriptsKeys[i]]) ;
			console.log("updateScriptsListFromConfig:config[scriptsKeys[i]]:",config[scriptsKeys[i]]) ;
			*/

			// Try to load config from config_filename
			try {
				if (typeof config[scriptsKeys[i]] !== 'undefined') {
					scriptsList[scriptsKeys[i]] = config[scriptsKeys[i]];
				}

			} catch (e) {
				console.log('updateScriptsListFromConfig:missing config filename: ' + config_filename + ' or "'+scriptsNames[i]+'" parameter is not defined.');
			}
		}
		console.log("updateScriptsListFromConfig:after updating with config_filename:",scriptsList);
	}
	catch (e) {
		scriptsList = defaultScriptsList;
		throw('Config file "'+config_filename+'" not found, using default values !');
	}
	return scriptsList;
};

module.exports.checkAllScriptsExist = function(callback, status) {
	var scriptsKeys = Object.keys(scriptsList);
	var globalStatus = 0;
	var errors = [];
	var firstError = true;

	if (scriptsKeys.length > 0) {
		for (var i=0; i<scriptsKeys.length; i++) {
			try {
				fs.accessSync(scriptsList[scriptsKeys[i]], fs.X_OK);
				globalStatus++;
			}
			catch (e) {
				if (firstError) {
					errors.push( 'You should probably check the config file '+config_filename );
					firstError = false
				}
				console.log ("checkAllScriptsExist:", e);
				errors.push( 'Script file "'+scriptsList[scriptsKeys[i]]+'" not found (parameter "'+scriptsKeys[i]+'") !' );
			}
		}

		globalStatus = (globalStatus/scriptsKeys.length)*100;
	}
	callback(errors.length ? errors : null, globalStatus);
};
