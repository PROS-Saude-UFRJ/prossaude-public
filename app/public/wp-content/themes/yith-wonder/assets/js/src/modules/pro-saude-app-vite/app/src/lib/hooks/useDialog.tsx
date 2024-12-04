import { MutableRefObject, useCallback, useEffect, useRef } from "react";
import { DlgProps } from "../global/declarations/interfaces";
import { nlDlg, rKbEv } from "../global/declarations/types";
import { useNavigate, useLocation } from "react-router-dom";
import { syncAriaStates } from "../global/handlers/gHandlers";
export default function useDialog({ state, dispatch, param }: DlgProps & { param: string }): {
  mainRef: MutableRefObject<nlDlg>;
  handleKp: (kp: rKbEv) => void;
  navigate: any;
} {
  const mainRef = useRef<nlDlg>(null),
    navigate = useNavigate(),
    location = useLocation(),
    handleKp = useCallback(
      (kp: rKbEv): void => {
        if (kp.key !== "ESCAPE") return;
        dispatch(!state);
        !state && mainRef.current?.close();
      },
      [state, dispatch],
    );
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    if (!urlParams.get(param)) {
      urlParams.set(param, "open");
      navigate(`?${urlParams.toString()}`, { replace: true });
    }
    return () => {
      urlParams.delete(param);
      navigate(`?${urlParams.toString()}`, { replace: true });
    };
  }, [location.search, param, navigate]);
  useEffect(() => {
    try {
      if (!(mainRef.current instanceof HTMLElement)) return;
      syncAriaStates([mainRef.current, ...mainRef.current.querySelectorAll("*")]);
      mainRef.current instanceof HTMLDialogElement && mainRef.current.showModal();
    } catch (e) {
      return;
    }
    addEventListener("keypress", handleKp);
    return (): void => removeEventListener("keypress", handleKp);
  }, [mainRef, handleKp, state]);
  return { mainRef, navigate, handleKp };
}
