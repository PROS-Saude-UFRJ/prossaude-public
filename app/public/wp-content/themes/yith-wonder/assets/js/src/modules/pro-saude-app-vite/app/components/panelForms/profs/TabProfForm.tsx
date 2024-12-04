import { normalizeSizeSb } from "../../../src/lib/global/gStyleScript";
import { initLoadedTab } from "../../../src/lib/locals/panelPage/handlers/consHandlerList";
import { handleClientPermissions } from "../../../src/lib/locals/panelPage/handlers/consHandlerUsers";
import { exporters, navigatorVars } from "../../../src/vars";
import { useEffect, useRef, useCallback, useContext } from "react";
import ProfRow from "./ProfRow";
import { nlBtn, nlFm, nlTab, nlTabSect } from "../../../src/lib/global/declarations/types";
import { ProfInfo } from "../../../src/lib/global/declarations/interfacesCons";
import { assignFormAttrs } from "../../../src/lib/global/gModel";
import { PanelCtx } from "../defs/client/SelectLoader";
import { ExportHandler } from "../../../src/lib/global/declarations/classes";
import useExportHandler from "../../../src/lib/hooks/useExportHandler";
import { Link } from "react-router-dom";
import { useDataFetch } from "../../../src/lib/hooks/useDataFetch";
import { privilege } from "../../../src/lib/locals/basePage/declarations/serverInterfaces";
import GenericErrorComponent from "../../error/GenericErrorComponent";
import { ErrorBoundary } from "react-error-boundary";
export default function TabProfForm(): JSX.Element {
  const userClass = useContext(PanelCtx).userClass,
    formRef = useRef<nlFm>(null),
    tabRef = useRef<nlTab>(null),
    tbodyRef = useRef<nlTabSect>(null),
    btnExportProfsTabRef = useRef<nlBtn>(null),
    { data: profData, loaded } = useDataFetch("profs", tabRef, (prof, i) => (
      <ProfRow nRow={i + 2} prof={prof as ProfInfo} tabRef={tabRef} key={`prof_row__${i + 2}`} />
    )),
    callbackNormalizeSizesSb = useCallback(() => {
      normalizeSizeSb(
        [
          ...document.querySelectorAll(".form-padded"),
          ...document.querySelectorAll(".ovFlAut"),
          ...document.querySelectorAll("[scrollbar-width=none]"),
        ],
        [false, 0],
        true,
        [document.getElementById("sectProfsTab")],
      );
      document.querySelector("table")!.style.minHeight = "revert";
      const nextDiv = document.getElementById("avPacsTab")?.nextElementSibling;
      if (nextDiv?.id === "" && nextDiv instanceof HTMLDivElement) nextDiv.remove() as void;
    }, []);
  useEffect(() => {
    if (!loaded) return;
    initLoadedTab(tabRef.current, userClass as privilege);
    handleClientPermissions(
      userClass,
      ["coordenador", "supervisor"],
      tabRef.current,
      document.getElementById("btnExport"),
    );
    callbackNormalizeSizesSb();
  }, [loaded, tabRef, userClass, callbackNormalizeSizesSb]);
  useExportHandler("tabProfExporter", formRef.current);
  useEffect(() => assignFormAttrs(formRef.current));
  return (
    <form
      id='formRemoveProf'
      name='form_profs_table'
      className='form-padded-nosb wid101'
      action='profs_table'
      encType='multipart/form-data'
      method='get'
      target='_top'
      autoComplete='on'
      ref={formRef}>
      <div role='group' className='wsBs flexNoWC cGap1v'>
        <h1 className='mg-3b bolded'>
          <strong id='titleTabProfs'>Tabela de Profissionais Registrados</strong>
        </h1>
        <em>
          <small role='textbox'>
            Verifique aqui as informações para leitura, alteração e remoção de profissionais no projeto.
          </small>
        </em>
        <hr />
      </div>
      <section className='form-padded pdL0' id='sectProfsTab'>
        <table className='table table-striped table-responsive table-hover tabPacs' id='avPacsTab' ref={tabRef}>
          <caption className='caption-t'>
            <strong>
              <small role='textbox'>
                <em>
                  Lista Recuperada da Ficha de Profissionais registrados. Acesse
                  <samp>
                    <Link
                      to={`${location.origin}/panel?panel=regist-prof`}
                      id='registProfLink'
                      style={{ display: "inline" }}>
                      &nbsp;Cadastrar Membro Profissional&nbsp;
                    </Link>
                  </samp>
                  para cadastrar
                </em>
              </small>
            </strong>
          </caption>
          <colgroup>
            {Array.from({ length: 5 }, (_, i) => (
              <col key={`prof_col__${i}`} data-col={i + 1}></col>
            ))}
            {userClass === "coordenador" &&
              Array.from({ length: 3 }, (_, i) => <col key={`prof_col__${i + 5}`} data-col={i + 6}></col>)}
          </colgroup>
          <thead className='thead-dark'>
            <tr id='avPacs-row1'>
              {userClass === "coordenador" && <th scope='col'>CPF</th>}
              {[
                "Nome",
                "Externo",
                "E-mail",
                "Telefone",
                "Área de Atuação",
                "Dia de Trabalho",
                "Período de Participação",
              ].map((l, i) => (
                <th key={`prof___th__${i}`} scope='col' data-col={userClass === "coordenador" ? i + 2 : i + 1}>
                  {l}
                </th>
              ))}
              {userClass === "coordenador" && <th scope='col'>Alteração</th>}
              {userClass === "coordenador" && <th scope='col'>Exclusão</th>}
            </tr>
          </thead>
          <ErrorBoundary
            FallbackComponent={() => (
              <GenericErrorComponent
                message={
                  navigatorVars.pt ? `Houve algum erro criando a tabela!` : `There was some error creating the table`
                }
              />
            )}>
            <tbody ref={tbodyRef}>{profData}</tbody>
          </ErrorBoundary>
        </table>
      </section>
      <button
        type='button'
        id='btnExport'
        className='btn btn-success flexAlItCt flexJC flexBasis50 bolded widQ460FullW'
        name='btnExportProfsTab'
        ref={btnExportProfsTabRef}
        data-active='false'
        title='Gere um .xlsx com os dados preenchidos'
        onClick={ev => {
          try {
            if (!exporters.tabProfExporter) exporters.tabProfExporter = new ExportHandler();
            exporters.tabProfExporter.handleExportClick(
              ev,
              "tabelaDeProfissionais",
              document.getElementById("titleTabProfs") ?? formRef.current ?? document,
              `d${new Date().getDate()}_m${new Date().getMonth() + 1}_y${new Date().getFullYear()}`,
            );
          } catch (e) {
            console.error(`Error executing callback:\n${(e as Error).message}`);
          }
          {
            signal: new AbortController().signal;
          }
        }}>
        Gerar Planilha
      </button>
    </form>
  );
}
