var form = document.getElementById("cform");

var lang = document.documentElement.lang || 'fr';
var i18n = {
  errorGeneric: lang === 'en' ? 'Oops! There was a problem submitting your form.' : 'Une erreur est survenue lors de l\'envoi.',
  errorNetwork:  lang === 'en' ? 'Network error. Please try again.' : 'Erreur réseau. Veuillez réessayer.'
};

function handleSubmit(event) {
  event.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  var status = document.getElementById("formAlertSuccess");
  var successMsg = status.querySelector('p');
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
        var msg = i18n.errorGeneric;
        if (Object.hasOwn(payload, 'errors')) {
          msg = payload["errors"].map(function(e) { return e["message"]; }).join(", ");
        }
        if (successMsg) successMsg.textContent = msg;
        status.style.display = 'block';
      });
    }
  }).catch(function() {
    if (successMsg) successMsg.textContent = i18n.errorNetwork;
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
