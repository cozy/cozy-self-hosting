var refresh_fqdn = function() {
    // Get fqdn from CozyDB
    $.get("./debian/fqdn", function(data) {
        // And update view
        $("#fqdn").val(data);
    });
};

var save_fqdn = function() {
    // Get new value in input text
    var form_value = $("#fqdn").val();
    // Push configuration
    $.post("./debian/fqdn", {fqdn: form_value}, function(data) {
        alert('Cozy configured with: ' + form_value + ' domain');
    });
};

var Application = {
  initialize: function () {
      refresh_fqdn();
      $("#refresh").click(function() {
          refresh_fqdn();
      });
      $("#save").click(function() {
          save_fqdn();
      });
  }
};

module.exports = Application;
