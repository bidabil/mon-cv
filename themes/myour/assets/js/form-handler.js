var form = document.getElementById("cform");

function handleSubmit(event) {
  event.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  var status = document.getElementById("formAlertSuccess");
  var submitBtn = form.querySelector('button[type="submit"]');
  var btnLabel = submitBtn ? submitBtn.querySelector('.animated-button span') : null;
  var originalLabel = btnLabel ? btnLabel.textContent : null;

  if (submitBtn) {
    submitBtn.disabled = true;
    if (btnLabel) btnLabel.textContent = "…";
  }

  var data = new FormData(form);
  fetch(form.action, {
    method: form.method,
    body: data,
    headers: { 'Accept': 'application/json' }
  }).then(function(response) {
    if (response.ok) {
      status.style.display = 'block';
      form.reset();
    } else {
      return response.json().then(function(payload) {
        if (Object.hasOwn(payload, 'errors')) {
          status.textContent = payload["errors"].map(function(e) { return e["message"]; }).join(", ");
        } else {
          status.textContent = "Oops! There was a problem submitting your form";
        }
        status.style.display = 'block';
      });
    }
  }).catch(function() {
    status.textContent = "Oops! There was a problem submitting your form";
    status.style.display = 'block';
  }).finally(function() {
    if (submitBtn) {
      submitBtn.disabled = false;
      if (btnLabel && originalLabel) btnLabel.textContent = originalLabel;
    }
  });
}

if (form != null) {
  form.addEventListener("submit", handleSubmit);
}
