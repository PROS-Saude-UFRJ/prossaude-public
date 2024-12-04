import { PseudoNum } from "../../../../src/lib/global/declarations/testVars";
import { nlInp } from "../../../../src/lib/global/declarations/types";
import { applyFieldConstraints } from "../../../../src/lib/global/gModel";
import { handleCondtReq } from "../../../../src/lib/global/handlers/gHandlers";
import { tabProps } from "../../../../src/vars";
import { useRef, useEffect, useState } from "react";
import sEn from "../../../../src/styles/modules/enStyles.module.scss";
export default function ProtUrLvl(): JSX.Element {
  const r = useRef<nlInp>(null),
    trusted = useRef<boolean>(false),
    [v, setValue] = useState<PseudoNum>("0");
  useEffect(() => {
    try {
      if (!trusted.current) return;
      if (!(r.current instanceof HTMLElement)) throw new Error(`Failed to validate reference for input`);
      handleCondtReq(r.current, {
        minNum: 0,
        maxNum: 9999,
        min: 1,
        max: 6,
        pattern: ["^d+$", ""],
      });
    } catch (e) {
      return;
    }
  }, [v, r, trusted]);
  return (
    <input
      ref={r}
      value={v}
      type='number'
      id='protUrLvl'
      name='protur_lvl'
      className={`form-control noInvert opProtUr ${sEn.protUrLvl}`}
      data-title='Proteinuria (mg/dL)'
      onInput={ev => {
        if (ev.isTrusted) trusted.current = true;
        if (!trusted.current) return;
        tabProps.edIsAutoCorrectOn && applyFieldConstraints(r.current);
        setValue(ev.currentTarget.value as PseudoNum);
      }}
    />
  );
}
