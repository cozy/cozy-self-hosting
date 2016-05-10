var refresh_fqdn = function() {
    // Get fqdn from CozyDB
    $.get("./debian/fqdn", function(data) {
        // And update view
        $("#input-fqdn").val(data);
    });
};

var save_fqdn = function() {
    // Get new value in input text
    var form_value = $("#input-fqdn").val();
    // Push configuration
    $.post("./debian/fqdn", {fqdn: form_value}, function(data) {
        $("#div-status-ko").hide();
        $("#div-status-ok").html(data.message).show();
    });
};

var host_halt = function() {
	// ask for halt host
	$("#button-halt").confirmation('hide')
    $.get("./debian/host/halt", function(data) {
        $("#div-status-ko").hide();
        $("#div-status-ok").html(data.message).show();
    });
};

var host_reboot = function() {
	// ask for halt host
	$("#button-reboot").confirmation('hide')
    $.get("./debian/host/reboot", function(data) {
        $("#div-status-ko").hide();
        $("#div-status-ok").html(data.message).show();
    });
};

var show_halt_reboot_buttons = function() {
    // Get fqdn from CozyDB
    $.get("./debian/host/isvps", function(data) {
        if (data.isVPS === false) {
			$("#button-halt-reboot-div").show();
        }
    });
};

var database_maintenance = function(option) {
	var url = "./debian/database/"+option;

	$("#div-status-ko").hide();
	$("#div-status-ok").html('Database maintenance operation "' + option + '" is running...').show();

    $.get(url, function(data) {
        $("#div-status-ko").hide();
        $("#div-status-ok").html(data.message).show();
    });
};

var Application = {
  initialize: function () {
	  show_halt_reboot_buttons();
      refresh_fqdn();
      $("#button-refresh").click(function() {
          refresh_fqdn();
      });
      $("#button-reconfigure").click(function() {
          save_fqdn();
      });
      $("#button-db-compact").click(function() {
          database_maintenance("compact");
      });
      $("#button-db-compact-views").click(function() {
          database_maintenance("views");
      });
      $("#button-db-cleanup").click(function() {
          database_maintenance("cleanup");
      });

	  $("#button-halt").confirmation({
		"title": "Do you really want to halt the host ?",
		"btnOkClass": "btn-danger",
		"btnCancelClass": "btn-info",
		"btnOkLabel": "SHUTDOWN",
		"btnCancelLabel": "CANCEL",
		"placement": "bottom",
		"popout": true,
		"singleton": true,
		"onConfirm": host_halt
	  });
	  $("#button-reboot").confirmation({
		"title": "Do you really want to reboot the host ?",
		"btnOkClass": "btn-warning",
		"btnCancelClass": "btn-info",
		"btnOkLabel": "REBOOT",
		"btnCancelLabel": "CANCEL",
		"placement": "bottom",
		"popout": true,
		"singleton": true,
		"onConfirm": host_reboot
	  });

      $(document).ajaxError(function(event, jqxhr, settings, thrownError) {
        $("#div-status-ok").hide();
		var data = JSON.parse(jqxhr.responseText);
		if (data.message) {
			$("#div-status-ko").html(thrownError + ':<br/>\n' + data.message).show();
		} else {
			$("#div-status-ko").html(thrownError + ':<br/>\n' + jqxhr.responseText).show();
		}
      });
  }
};

module.exports = Application;
