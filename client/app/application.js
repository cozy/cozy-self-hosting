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

var Application = {
  initialize: function () {
      refresh_fqdn();
      $("#button-refresh").click(function() {
          refresh_fqdn();
      });
      $("#button-reconfigure").click(function() {
          save_fqdn();
      });
      $(document).ajaxError(function(event, jqxhr, settings, thrownError) {
        $("#div-status-ok").hide();
        $("#div-status-ko").html(thrownError + ':<br/>\n' + jqxhr.responseText).show();
      });
  }
};

module.exports = Application;
