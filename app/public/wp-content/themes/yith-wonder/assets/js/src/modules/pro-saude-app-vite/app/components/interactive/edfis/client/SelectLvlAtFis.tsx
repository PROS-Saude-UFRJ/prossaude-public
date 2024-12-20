import { useContext, useEffect, useRef } from "react";
import { ENCtx } from "./ENForm";
import { ENCtxProps } from "../../../../src/lib/global/declarations/interfaces";
import { Intensity } from "../../../../src/lib/global/declarations/testVars";
import { camelToRegular } from "../../../../src/lib/global/gModel";
import { person, tabProps, timers } from "../../../../src/vars";
import { callbackAtvLvlElementNaf, exeAutoFill } from "../../../../src/lib/locals/edFisNutPage/edFisNutHandler";
import sEn from "../../../../src/styles/modules/enStyles.module.scss";
import { NlMRef, nlSel } from "../../../../src/lib/global/declarations/types";
export default function SelectLvlAtFis(): JSX.Element {
  let gl: NlMRef<nlSel> = null,
    nafr: NlMRef<nlSel> = null,
    fct: NlMRef<nlSel> = null,
    sar: NlMRef<nlSel> = null;
  const ctx1 = useContext<ENCtxProps>(ENCtx),
    trusted = useRef<boolean>(false),
    idf = "selectLvlAtFis",
    levels: Intensity[] = ["leve", "moderado", "intenso", "muitoIntenso", "sedentario"];
  if (ctx1?.refs) ({ gl, nafr, fct, sar } = ctx1.refs);
  useEffect(() => {
    tabProps.sa = sar?.current ?? document.getElementById(idf);
  }, [sar]);
  useEffect(() => {
    setTimeout(() => {
      try {
        const query = document.getElementById(idf);
        person.dispatchAtvLvl(
          (sar?.current?.value as Intensity) ||
            (((query instanceof HTMLSelectElement || query instanceof HTMLInputElement) &&
              (query as HTMLSelectElement).value) as Intensity) ||
            "leve",
        );
      } catch (e) {
        return;
      }
    }, timers.personENTimer * 0.75);
  }, [sar]);
  return (
    <select
      ref={sar}
      id={idf}
      className={`form-select labelIdentif ${sEn.select} ${sEn.selectLvlAtFis} ${sEn.labelIdentif}`}
      name='atv_lvl'
      data-title='Nivel de Atividade Física'
      required
      onChange={ev => {
        try {
          if (ev.isTrusted) trusted.current = true;
          if (!trusted.current) return;
          callbackAtvLvlElementNaf(idf ?? "", {
            sa: sar?.current ?? document.getElementById("selectLvlAtFis"),
            gl: gl?.current ?? document.getElementById("gordCorpLvl"),
            naf: nafr?.current ?? document.getElementById("nafType"),
            fct: fct?.current ?? document.getElementById("formCalcTMBType"),
          });
          person.dispatchAtvLvl(ev.currentTarget.value);
          tabProps.edIsAutoCorrectOn && exeAutoFill(tabProps.sa);
        } catch (e) {
          return;
        }
      }}>
      {levels.map((o, i) => (
        <option key={`AtFis_op__${i}`} value={o} className='opLvlAtFis'>
          {o === "sedentario" ? "Sedentário" : camelToRegular(o)}
        </option>
      ))}
    </select>
  );
}
