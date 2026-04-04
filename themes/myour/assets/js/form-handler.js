const form = document.getElementById("cform");

const lang = document.documentElement.lang || 'fr';
const i18n = {
  errorGeneric: lang === 'en' ? 'Oops! There was a problem submitting your form.' : 'Une erreur est survenue lors de l\'envoi.',
  errorNetwork:  lang === 'en' ? 'Network error. Please try again.' : 'Erreur réseau. Veuillez réessayer.'
};

function handleSubmit(event) {
  event.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const status = document.getElementById("formAlertSuccess");
  const successMsg = status.querySelector('p');
  const submitBtn = form.querySelector('button[type="submit"]');
  const btnLabel = submitBtn ? submitBtn.querySelector('.animated-button span') : null;
  const originalLabel = btnLabel ? btnLabel.textContent : null;

  if (submitBtn) {
    submitBtn.disabled = true;
    if (btnLabel) btnLabel.textContent = "…";
  }

  const data = new FormData(form);
  fetch(form.action, {
    method: form.method,
    body: data,
    headers: { 'Accept': 'application/json' }
  }).then(function(response) {
    if (response.ok) {
      status.dataset.state = 'success';
      status.style.display = 'block';
      form.reset();
    } else {
      return response.json().then(function(payload) {
        let msg = i18n.errorGeneric;
        if (Object.hasOwn(payload, 'errors')) {
          msg = payload["errors"].map(function(e) { return e["message"]; }).join(", ");
        }
        if (successMsg) successMsg.textContent = msg;
        status.dataset.state = 'error';
        status.style.display = 'block';
      });
    }
  }).catch(function() {
    if (successMsg) successMsg.textContent = i18n.errorNetwork;
    status.dataset.state = 'error';
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
