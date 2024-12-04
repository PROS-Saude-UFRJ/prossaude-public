"use client";
import { ErrorBoundary } from "react-error-boundary";
import { elementNotFound, extLine, inputNotFound } from "../../src/lib/global/handlers/errorHandler";
import { filterTabMembers, initLoadedTab } from "../../src/lib/locals/panelPage/handlers/consHandlerList";
import { nlTab, nlTabSect } from "../../src/lib/global/declarations/types";
import { useRef, useEffect, useContext } from "react";
import StudRow from "../panelForms/studs/StudRow";
import { StudInfo, StudListProps } from "../../src/lib/global/declarations/interfacesCons";
import { PanelCtx } from "../panelForms/defs/client/SelectLoader";
import { Link } from "react-router-dom";
import { useDataFetch } from "../../src/lib/hooks/useDataFetch";
import GenericErrorComponent from "../error/GenericErrorComponent";
import { privilege } from "../../src/lib/locals/basePage/declarations/serverInterfaces";
export default function StudList({ mainDlgRef }: StudListProps): JSX.Element {
  const tabRef = useRef<nlTab>(null),
    tbodyRef = useRef<nlTabSect>(null),
    userClass = useContext(PanelCtx).userClass,
    { data: studsData, loaded } = useDataFetch("studs", tbodyRef, (stud, i) => (
      <ErrorBoundary FallbackComponent={() => <GenericErrorComponent message={`Error generating row ${i + 1}`} />}>
        <StudRow nRow={i + 2} stud={stud as StudInfo} tabRef={tabRef} key={`stud_row__${i + 2}`} inDlg={true} />
      </ErrorBoundary>
    ));
  useEffect(() => {
    try {
      if (!loaded) return;
      initLoadedTab(tabRef.current, userClass as privilege);
      try {
        const typeConsSel = mainDlgRef.current?.querySelector("#typeConsSel");
        if (!(typeConsSel instanceof HTMLSelectElement))
          throw inputNotFound(
            typeConsSel,
            `<select> for getting type of appointment for ${tabRef.current?.id || "UNIDENTIFIED"}`,
            extLine(new Error()),
          );
        const [selectedOp] = Array.from(typeConsSel.querySelectorAll("option"));
        if (!(selectedOp instanceof HTMLOptionElement))
          throw elementNotFound(
            selectedOp,
            `<option> for getting type of appointment for ${tabRef.current?.id || "UNIDENTIFIED"}`,
            extLine(new Error()),
          );
        const relOptgrp = selectedOp.closest("optgroup");
        if (relOptgrp instanceof HTMLOptGroupElement && relOptgrp.label !== "")
          filterTabMembers(tabRef.current, relOptgrp.label.toLowerCase().trim());
      } catch (e) {
        console.error(`Error executing for styling table:\n${(e as Error).message}`);
      }
    } catch (e) {
      return;
    }
  }, [loaded, tabRef, tabRef, userClass]);
  return (
    <table className='table table-striped table-responsive table-hover tabProfs' id='avStudsTab' ref={tabRef}>
      <caption className='caption-t'>
        <strong>
          <small role='textbox' className='noInvert'>
            <em className='noInvert'>
              Lista Recuperada da Ficha de Estudantes registrados. Acesse
              <samp>
                <Link
                  to={`${location.origin}/panel?panel=regist-stud`}
                  id='linkRegistStud'
                  style={{ display: "inline" }}>
                  &nbsp;Cadastrar Aluno&nbsp;
                </Link>
              </samp>
              para cadastrar
            </em>
          </small>
        </strong>
      </caption>
      <colgroup>
        {Array.from({ length: 7 }, (_, i) => (
          <col key={`stud_col__${i}`} data-col={i + 1}></col>
        ))}
        {userClass === "coordenador" && <col data-col='8'></col>}
        {userClass === "coordenador" && <col data-col='9'></col>}
      </colgroup>
      <thead className='thead-dark'>
        <tr id='avStuds-row1' data-row='1'>
          {userClass === "coordenador" && (
            <th scope='col' data-row='1' data-col='1'>
              CPF
            </th>
          )}
          {userClass === "coordenador" && (
            <th scope='col' data-row='1' data-col='2'>
              DRE
            </th>
          )}
          {["Nome", "E-mail", "Telefone", "Próximo Dia de Consulta", "Período de Acompanhamento", ""].map((l, i) => (
            <th scope='col' key={`pac_th__${i}`} data-row={1} data-col={userClass === "coordenador" ? i + 3 : i + 1}>
              {l}
            </th>
          ))}
        </tr>
      </thead>
      <tbody id='avStudsTbody' ref={tbodyRef}>
        {studsData}
      </tbody>
    </table>
  );
}
