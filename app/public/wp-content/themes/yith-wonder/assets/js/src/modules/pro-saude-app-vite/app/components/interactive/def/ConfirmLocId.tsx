import { handleEventReq } from "../../../src/lib/global/handlers/gHandlers";
import { nlInp } from "../../../src/lib/global/declarations/types";
import { useEffect, useRef, useState } from "react";
import s from "../../../src/styles/modules/sharedComponents.module.scss";
import { useLocation } from "react-router-dom";
export default function ConfirmLocId(): JSX.Element {
  const mainRef = useRef<nlInp>(null),
    [value, setValue] = useState("Rio de Janeiro, Rio de Janeiro"),
    location = useLocation();
  useEffect(() => {
    if (mainRef.current instanceof HTMLInputElement && mainRef.current.value === "") mainRef.current.value = value;
  }, [value]);
  return (
    <input
      type='text'
      ref={mainRef}
      name='confirmLocName'
      id='confirmLocId'
      className={`inpConfirm form-control noInvert ${/edfis/gi.test(location.pathname) ? `${s.confirmLocIdEn}` : ""}`}
      data-xls='Local de Assinatura'
      data-title='assinatura_local'
      required
      style={{ minWidth: "16rem" }}
      onInput={ev => {
        const newValue = ev.currentTarget.value;
        setValue(newValue);
        handleEventReq(ev.currentTarget);
      }}
    />
  );
}
