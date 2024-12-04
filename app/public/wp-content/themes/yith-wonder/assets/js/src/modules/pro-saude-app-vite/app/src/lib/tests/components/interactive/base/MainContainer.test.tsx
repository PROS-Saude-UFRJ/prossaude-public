import { RootCtx } from "@/App";
import { useNavigate } from "react-router-dom";
import { useEffect, useContext, useRef } from "react";
import { toast } from "react-hot-toast";
import sMc from "@/styles/modules/mainContainer.module.scss";
import NavCard from "./NavCard";
import useMount from "@/lib/hooks/useMount";
import EnhancedUserProfilePanel from "../../user/EnhancedUserProfilePanel";

export default function MainContainer(): JSX.Element {
  const ctx = useContext(RootCtx);
  const navigate = useNavigate();
  const toasted = useRef(false);
  const mounted = useMount();

  useEffect(() => {
    if (mounted) {
      const bg = document.getElementById("bgDiv");
      if (!(bg instanceof HTMLElement)) return;
      if (!/gradient/gi.test(getComputedStyle(bg).background)) {
        window.location.reload();
      }
    }
  }, [mounted]);

  useEffect(() => {
    if (!toasted.current) {
      toast("Navigate through the pages using the cards!", { icon: "🧭" });
      toasted.current = true;
    }
    const untoast = () => toast.dismiss();
    addEventListener("popstate", untoast);
    return () => removeEventListener("popstate", untoast);
  }, [toasted]);

  return (
    <main className={sMc.mainContainer} id='main-container'>
      <section id='cardsSect' className={sMc.cardsSect}>
        {["/ag", "/edfis", "/nut", "/od"].map(href => (
          <NavCard key={href} href={href} />
        ))}
      </section>
      <section id='panelSect' className={sMc.panelSect} onMouseEnter={() => navigate("/panel")}>
        <button type='button' id='panelBtn' className={sMc.panelBtn}>
          Work Panel
        </button>
      </section>
    </main>
  );
}
