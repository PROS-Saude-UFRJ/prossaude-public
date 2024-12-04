import { generateUUID } from "./gHandlers";
import ReactDOM from "react-dom";

export function fillIds(ref: HTMLElement): string {
  let proposedId = generateUUID(),
    acc = 0;
  const allIds = Array.from(document.querySelectorAll("*")).map(el => el.id);
  while (allIds.find(elId => proposedId === elId)) {
    proposedId = generateUUID();
    if (acc > 999) {
      proposedId = `${new Date().getUTCMilliseconds()}-${new Date().getUTCMinutes()}-${new Date().getUTCHours()}-${new Date().getUTCDay()}-${new Date().getUTCMonth()}-${new Date().getUTCFullYear()}`;
      break;
    }
  }
  const fs = ref.closest("fieldset");
  if (fs && fs.id === "") fs.id = `fs__${proposedId}`;
  return proposedId;
}
export function gatherFormData(
  ref: HTMLInputElement | HTMLTextAreaElement,
  label: HTMLLabelElement | null,
): void {
  const form = ref.closest("form");
  if (form) {
    if (!form.noValidate) ref.dataset.willValidate = "true";
    else ref.dataset.willValidate = "false";
    ref.dataset.charset = form.acceptCharset;
    if (ref instanceof HTMLInputElement) {
      ref.formAction = form.action;
      ref.formEnctype = form.enctype;
      ref.formMethod = form.method;
    }
  } else ref.dataset.willValidate = "false";
  if (label) ref.dataset.label = label.id;
}
export function renderWatcher(
  component: JSX.Element,
  el: HTMLElement,
  wrapperSelector: string = ".form-control-wrapper",
  watcherSelector: string = ".form-control-watcher",
): boolean {
  try {
    const watcher = el.closest(wrapperSelector)?.querySelector(watcherSelector);
    if (!watcher) throw new Error(`Failed to locate form control watcher`);
    ReactDOM.render(component, watcher);
    return true;
  } catch (e) {
    console.error(
      `Error executing procere for ${el.id || el.className || el.tagName}\n:${
        (e as Error).message
      }`,
    );
    return false;
  }
}
