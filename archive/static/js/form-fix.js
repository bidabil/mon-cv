// Fix: Prevent form submission when fields are empty
// This script runs after form-handler.js and common.js
document.addEventListener('DOMContentLoaded', function() {
  var form = document.getElementById("cform");
  if (!form) return;

  // Remove all existing submit listeners by replacing the form
  var newForm = form.cloneNode(true);
  form.parentNode.replaceChild(newForm, form);

  // Re-initialize jQuery validate on the new form
  if (typeof jQuery !== 'undefined') {
    jQuery(newForm).validate({
      rules: {
        name: { required: true },
        message: { required: true },
        email: { required: true, email: true }
      },
      success: 'valid',
      submitHandler: function() {
        // This only runs when form is valid
        var status = document.getElementById("formAlertSuccess");
        var data = new FormData(newForm);
        fetch(newForm.action, {
          method: newForm.method,
          body: data,
          headers: { 'Accept': 'application/json' }
        }).then(function(response) {
          if (response.ok) {
            status.textContent = "Thanks for your submission!";
            status.style.display = 'block';
            newForm.reset();
          } else {
            response.json().then(function(data) {
              if (Object.hasOwn(data, 'errors')) {
                status.textContent = data["errors"].map(function(error) { return error["message"]; }).join(", ");
              } else {
                status.textContent = "Oops! There was a problem submitting your form";
              }
              status.style.display = 'block';
            });
          }
        }).catch(function(error) {
          status.textContent = "Oops! There was a problem submitting your form";
          status.style.display = 'block';
        });
      }
    });
  }
});
