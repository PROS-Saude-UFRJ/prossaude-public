import FormRadiosWatcher from "./watcher";
import { renderWatcher } from "../../../../lib/global/handlers/blockHandlers";
addEventListener("DOMContentLoaded", () => {
  console.log("Rendering watcher...");
  for (const el of document.querySelectorAll("input.form-control")) {
    if (!(el instanceof HTMLInputElement)) continue;
    renderWatcher(<FormRadiosWatcher />, el);
  }
});
