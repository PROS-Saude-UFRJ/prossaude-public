document.addEventListener("DOMContentLoaded", () => {
  try {
    document.querySelectorAll('[type="password"]').forEach((el) => {
      el.addEventListener("keyup", (ev) => {
        if (ev.key !== "Escape") return;
        const ancestral = ev.currentTarget.parentElement?.parentElement;
        if (!ancestral) return;
        const hider =
          ancestral.querySelector(".wp-hide-pw.hide-if-no-js") ||
          ancestral.querySelector(".showPw") ||
          ancestral.querySelector("#spanShowPw");
        if (!hider) return;
        hider.click();
      });
    });
  } catch (e) {
    console.error("Failed to attach listeners during load");
  }
  try {
    const logo = document.querySelector(".wp-login-logo");
    if (!logo) return;
    logo.innerHTML = "";
    const img = document.createElement("img");
    img.src =
      "http://prossaude-ufrj-test.local/wp-content/uploads/2024/11/PROS_edfis_icon.webp";
    img.crossOrigin = "anonymous";
    img.width = 96;
    img.height = 96;
    img.loading = "eager";
    img.decoding = "async";
    logo.appendChild(img);
  } catch (e) {
    console.error(`Failed to execute procedure for replacing logo`);
  }
  setTimeout(() => {
    for (const msg of document.querySelectorAll(".message")) msg.remove();
  }, 3000);
  setTimeout(() => {
    if (!document.body) return;
    document.body.style.opacity = "1";
  }, 1000);
  (() => {
    if (!document.body) return;
    document.body.style.transition += "opacity 1s ease-in-out";
    setTimeout(() => {
      if (!document.body) return;
      document.body.style.opacity = "1";
    }, 500);
  })();
});
