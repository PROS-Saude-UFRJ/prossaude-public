import { RootCtx } from "../../../src/App";
import { equalizeParagraphs } from "../../../src/lib/locals/basePage/baseStylescript";
import { expandContent } from "../../../src/lib/global/gStyleScript";
import { targEl } from "../../../src/lib/global/declarations/types";
import { useEffect, useContext, useRef } from "react";
import EnhancedUserProfilePanel from "../../user/EnhancedUserProfilePanel";
import { toast } from "react-hot-toast";
import sMc from "../../../src/styles/modules/mainContainer.module.scss";
import { navigatorVars, reloader } from "../../../src/vars";
import NavCard from "./NavCard";
import useMount from "../../../src/lib/hooks/useMount";
import { Link } from "react-router-dom";
import ReactDOM from "react-dom";
let baseRootUser: targEl;
export default function MainContainer() {
  const ctx = useContext(RootCtx),
    toasted = useRef(false),
    mounted = useMount();
  useEffect(() => {
    if (!mounted) return;
    setTimeout(() => {
      const bg = document.getElementById("bgDiv");
      if (!(bg instanceof HTMLElement)) return;
      if (!/gradient/gi.test(getComputedStyle(bg).background) && reloader.canReloadBase) {
        reloader.canReloadBase = false;
        location.reload();
      }
    }, 200);
  }, [mounted]);
  useEffect(() => {
    baseRootUser = document.getElementById("rootUserInfo");
    if (baseRootUser) ReactDOM.render(<EnhancedUserProfilePanel />, baseRootUser);
    equalizeParagraphs(Array.from(document.querySelectorAll("small")));
    expandContent(document.getElementById("rootUserInfo"));
  }, [ctx.roots]);
  useEffect(() => {
    if (!toasted.current)
      toast(
        navigatorVars.pt
          ? "Navegue pelas páginas clicando nas logos ou movendo o mouse sobre os cartões para ver os botões!"
          : "Navigate through the pages clicking on the logos or hovering the cards to show the buttons!",
        { icon: "🧭" },
      );
    setTimeout(toast.dismiss, 5000);
    toasted.current = true;
    const untoast = () => toast.dismiss();
    addEventListener("popstate", untoast);
    return () => removeEventListener("popstate", untoast);
  }, []);
  return (
    <main className={sMc.mainContainer} id='main-container'>
      <section id='cardsSect' className={sMc.cardsSect}>
        {["/ag", "/edfis", "/nut", "/od"].map(href => (
          <NavCard key={`card__${href}`} href={href} />
        ))}
      </section>
      <section id='panelSect' className={sMc.panelSect}>
        <button
          type='button'
          id='panelBtn'
          className={`btn btn-primary btn-rounded wid80p750Q ${sMc.panelBtn}`}
          style={{ height: "3.5rem", borderRadius: "1rem" }}
          onTouchStart={ev => {
            try {
              ev.currentTarget.style.backgroundColor = "#0056b3";
              ev.currentTarget.style.transform = "translateY(-0.1rem)";
            } catch (e) {
              return;
            }
          }}>
          <Link
            to={`${location.origin}/interno/panel`.replace(/\/{2,}/g, "")}
            id='panelAnchor'
            style={{ color: "#ffff", fontWeight: "600" }}>
            Painel de Trabalho
          </Link>
        </button>
      </section>
    </main>
  );
}
