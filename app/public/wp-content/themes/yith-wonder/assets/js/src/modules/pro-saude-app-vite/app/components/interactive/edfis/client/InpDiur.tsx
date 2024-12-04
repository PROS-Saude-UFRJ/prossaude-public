import { PseudoNum } from "../../../../src/lib/global/declarations/testVars";
import { nlInp } from "../../../../src/lib/global/declarations/types";
import { applyFieldConstraints } from "../../../../src/lib/global/gModel";
import { handleCondtReq } from "../../../../src/lib/global/handlers/gHandlers";
import { tabProps } from "../../../../src/vars";
import { useRef, useEffect, useState } from "react";
import sEn from "../../../../src/styles/modules/enStyles.module.scss";
export default function InpDiur(): JSX.Element {
  const r = useRef<nlInp>(null),
    [v, setValue] = useState<PseudoNum>("" as any);
  useEffect(() => {
    try {
      if (!(r.current instanceof HTMLElement)) return;
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
  }, [v, r]);
  return (
    <input
      ref={r}
      value={v}
      type='number'
      name='diur'
      className={`form-control noInvert inpAlimRot inpUr float ${sEn.inpDiur}`}
      id='inpDiur'
      data-title='Diurese'
      onInput={ev => {
        tabProps.edIsAutoCorrectOn && applyFieldConstraints(ev.currentTarget);
        setValue(ev.currentTarget.value as PseudoNum);
      }}
    />
  );
}
