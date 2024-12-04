"use client";
import { ErrorBoundary } from "react-error-boundary";
import { elementNotFound, extLine } from "../../src/lib/global/handlers/errorHandler";
import { useContext, useEffect, useRef } from "react";
import GenericErrorComponent from "../error/GenericErrorComponent";
import PacRow from "../panelForms/pacs/PacRow";
import { nlHtEl, nlTab, nlTabSect } from "../../src/lib/global/declarations/types";
import { PacInfo, PacListProps } from "../../src/lib/global/declarations/interfacesCons";
import { addListenerAlocation, initLoadedTab } from "../../src/lib/locals/panelPage/handlers/consHandlerList";
import { PanelCtx } from "../panelForms/defs/client/SelectLoader";
import { Link } from "react-router-dom";
import { useDataFetch } from "../../src/lib/hooks/useDataFetch";
import { privilege } from "../../src/lib/locals/basePage/declarations/serverInterfaces";
export default function PacList({
  shouldDisplayRowData,
  setDisplayRowData,
  dispatch,
  shouldShowAlocBtn = true,
  state = true,
}: PacListProps): JSX.Element {
  const userClass = useContext(PanelCtx).userClass,
    tabPacRef = useRef<nlTab>(null),
    sectTabRef = useRef<nlHtEl>(null),
    tbodyRef = useRef<nlTabSect>(null),
    { data: pacsData, loaded } = useDataFetch("patients", tbodyRef, (pac, i) => (
      <ErrorBoundary FallbackComponent={() => <GenericErrorComponent message={`Error carregando linha ${i + 1}`} />}>
        <PacRow
          nRow={i + 2}
          pac={pac as PacInfo}
          shouldShowAlocBtn={shouldShowAlocBtn}
          tabRef={tabPacRef}
          key={`pac_row__${i + 2}`}
        />
      </ErrorBoundary>
    ));
  useEffect(() => {
    if (!(sectTabRef.current instanceof HTMLElement)) return;
    const handleKeyDown = (press: KeyboardEvent): boolean | void =>
      press.key === "Escape" && setDisplayRowData(!shouldDisplayRowData);
    addEventListener("keydown", handleKeyDown);
    return (): void => removeEventListener("keydown", handleKeyDown);
  }, [sectTabRef, setDisplayRowData]);
  useEffect(() => {
    try {
      if (!loaded) return;
      initLoadedTab(sectTabRef.current, userClass as privilege);
      try {
        if (!(sectTabRef?.current instanceof HTMLElement))
          throw elementNotFound(sectTabRef.current, "sectTabRef in useEffect()", extLine(new Error()));
        document.querySelectorAll(".outpPacStatus").forEach(status => {
          if (!(status instanceof HTMLElement)) return;
          if (status.innerText.toLowerCase().trim() === "em emergência") status.style.color = `red`;
        });
        const ancestral = document.getElementById("regstPacDlg");
        ancestral &&
          dispatch &&
          sectTabRef.current
            .querySelectorAll(".btnAloc")
            .forEach(btn => addListenerAlocation(btn, ancestral, ancestral, "Pac", state, dispatch, userClass));
      } catch (e) {
        console.error(`Error executing for styling table:\n${(e as Error).message}`);
      }
    } catch (e) {
      return;
    }
  }, [loaded, sectTabRef, dispatch, tabPacRef, userClass]);
  return (
    <section className='form-padded' id='sectPacsTab' ref={sectTabRef}>
      <table className='table table-striped table-responsive table-hover tabPacs' id='avPacsTab' ref={tabPacRef}>
        <caption className='caption-t'>
          <strong>
            <small role='textbox' className='noInvert'>
              <em className='noInvert'>
                Lista Recuperada da Ficha de Pacientes registrados. Acesse
                <samp>
                  <Link to={`${location.origin}/ag`} id='idLink' style={{ display: "inline" }}>
                    &nbsp;Anamnese Geral&nbsp;
                  </Link>
                </samp>
                para cadastrar
              </em>
            </small>
          </strong>
        </caption>
        <colgroup>
          {Array.from({ length: 8 }, (_, i) => (
            <col key={i + 1} data-col={i + 1} />
          ))}
          {userClass === "coordenador" && Array.from({ length: 3 }, (_, i) => <col key={i + 9} data-col={i + 9} />)}
          {shouldShowAlocBtn && <col key={12} data-col={12} />}
        </colgroup>
        <thead className='thead-dark'>
          <tr id={`avPacs-rowUnfilled0`} data-row={1}>
            {userClass === "coordenador" && (
              <th scope='col' data-row={1} data-col={1}>
                CPF
              </th>
            )}
            {["Nome", "E-mail", "Telefone", "Próxima Dia de Consulta", "Período de Acompanhamento"].map((l, i) => (
              <th key={`pac_th__${i}`} scope='col' data-row={1} data-col={userClass === "coordenador" ? i + 2 : i + 1}>
                {l}
              </th>
            ))}
            {userClass === "coordenador" && (
              <th scope='col' data-row={1} data-col={7}>
                Assinatura
              </th>
            )}
            {["Status", "Histórico"].map((l, i) => (
              <th
                key={`pac_th__${i + 8}`}
                scope='col'
                data-row={1}
                data-col={userClass === "coordenador" ? i + 8 : i + 6}>
                {l}
              </th>
            ))}
            {userClass === "coordenador" &&
              ["Alteração", "Exclusão"].map((l, i) => (
                <th key={`pac_th__${i + 10}`} scope='col' data-row={1} data-col={i + 10}>
                  {l}
                </th>
              ))}
            {shouldShowAlocBtn && (
              <th className='alocCel' scope='col' data-row={1} data-col={userClass === "coordenador" ? 12 : 8}>
                Alocação
              </th>
            )}
          </tr>
        </thead>
        <tbody className='pacTbody' ref={tbodyRef}>
          {pacsData}
        </tbody>
      </table>
    </section>
  );
}
