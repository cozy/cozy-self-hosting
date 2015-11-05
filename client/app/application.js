// Application bootstrapper.
var refresh_fqdn = function() {
    // alert('Click on refresh');
    $.get("./debian/fqdn", function(data) {
        $("#fqdn").val(data);
    });
};

var save_fqdn = function() {
    // alert('Click on save');
    var form_value = $("#fqdn").val();
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
