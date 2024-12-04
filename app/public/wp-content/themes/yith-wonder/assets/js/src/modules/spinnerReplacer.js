addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
	  for (const e of ['header', 'footer']) document.querySelector(e)?.style.display = 'none';
      Array.from(document.querySelector('main')?.children ?? []).forEach(c => {
      	  if (c instanceof HTMLScriptElement || c.classList.contains('entry-content')) return;
          if (c instanceof HTMLElement) c.style.display = 'none';
        });
      alert('Hiding header and footer');
    }, 300);
  setTimeout(function () {
    var thisScript = document.getElementById("spinnerReplacer");
    var spinner = document.getElementById("ini-spinner");
    if (!spinner) {
      thisScript.remove();
      return;
    }
    var errorHeader = document.createElement("h1");
    errorHeader.textContent =
      "ERROR: Could not load the page. Check your connection. 👾";
    errorHeader.style.marginLeft = "10%";
    errorHeader.style.marginTop = "10%";
    spinner.replaceWith(errorHeader);
    thisScript.remove();
  }, 120000);
});