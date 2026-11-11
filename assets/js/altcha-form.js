/* ============================================================
   Anti-robot ALTCHA : si le visiteur envoie le formulaire avant la
   fin du calcul (1 à 2 s), le navigateur bloque l'envoi sur la case
   du widget. On attend alors la fin du calcul et on renvoie le
   formulaire automatiquement, sans lui demander de recliquer.
   ============================================================ */
document.querySelectorAll('form').forEach((form) => {
  const widget = form.querySelector('altcha-widget');
  if (!widget) return;
  form.addEventListener('invalid', (e) => {
    if (!widget.contains(e.target)) return;
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    if (btn) { btn.dataset.label = btn.dataset.label || btn.textContent; btn.textContent = 'Vérification anti-robot…'; }
    const onState = (ev) => {
      const state = ev.detail && ev.detail.state;
      if (state === 'verified') {
        widget.removeEventListener('statechange', onState);
        if (btn) btn.textContent = btn.dataset.label;
        form.requestSubmit();
      } else if (state === 'error' || state === 'expired') {
        widget.removeEventListener('statechange', onState);
        if (btn) btn.textContent = btn.dataset.label;
      }
    };
    widget.addEventListener('statechange', onState);
    if (widget.getState && widget.getState() !== 'verifying' && widget.verify) widget.verify();
  }, true);
});
