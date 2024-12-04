"use client";
import { ErrorBoundary } from "react-error-boundary";
import { elementNotFound, extLine, inputNotFound } from "../../src/lib/global/handlers/errorHandler";
import { isClickOutside } from "../../src/lib/global/gStyleScript";
import { handleFetch } from "../../src/lib/global/data-service";
import { navigatorVars } from "../../src/vars";
import { syncAriaStates } from "../../src/lib/global/handlers/gHandlers";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import ErrorFallbackDlg from "../error/ErrorFallbackDlg";
import GenericErrorComponent from "../error/GenericErrorComponent";
import ProfRow from "../panelForms/profs/ProfRow";
import { nlHtEl, nlTab, nlTabSect } from "../../src/lib/global/declarations/types";
import { AvProfListDlgProps, ProfInfo } from "../../src/lib/global/declarations/interfacesCons";
import {
  addListenerAlocation,
  filterTabMembers,
  initLoadedTab,
} from "../../src/lib/locals/panelPage/handlers/consHandlerList";
import { PanelCtx } from "../panelForms/defs/client/SelectLoader";
import { Link } from "react-router-dom";
import useDialog from "../../src/lib/hooks/useDialog";
import { toast } from "react-hot-toast";
import { codifyError } from "../../src/lib/global/handlers/errorHandler";
import TabSpinner from "../icons/TabSpinner";
import { ProfInfoValidator } from "../../src/lib/global/declarations/classes";
import { privilege } from "../../src/lib/locals/basePage/declarations/serverInterfaces";
export default function AvProfListDlg(props: AvProfListDlgProps): JSX.Element {
  const userClass = useContext(PanelCtx).userClass,
    spinner = (
      <TabSpinner
        key={new Date().getTime()}
        spinnerClass='spinner-border'
        spinnerColor='text-info'
        message='Loading data...'
      />
    ),
    internalProfs: ProfInfo[] = useMemo(() => [], []),
    externalProfs: ProfInfo[] = useMemo(() => [], []),
    [loaded, setLoad] = useState<boolean>(false),
    [intData, setIntData] = useState<JSX.Element[]>([spinner]),
    [extData, setExtData] = useState<JSX.Element[]>([
      <TabSpinner
        key={new Date().getTime()}
        spinnerClass='spinner-border'
        spinnerColor='text-info'
        message='Loading data...'
      />,
    ]),
    validator = new ProfInfoValidator().validate,
    tabProfIntRef = useRef<nlTab>(null),
    tabProfExtRef = useRef<nlTab>(null),
    tbodyIntRef = useRef<nlTabSect>(null),
    tbodyExtRef = useRef<nlTabSect>(null),
    secttabProfIntRef = useRef<nlHtEl>(null),
    tabToasted = useRef<boolean>(false),
    { mainRef } = useDialog({ state: props.state, dispatch: props.dispatch, param: "av-prof" });
  useEffect(() => {
    try {
      if (!(tbodyExtRef.current instanceof HTMLTableSectionElement))
        throw elementNotFound(tbodyExtRef.current, `Validation of Table Body instance`, extLine(new Error()));
      if (!(tbodyIntRef.current instanceof HTMLTableSectionElement))
        throw elementNotFound(tbodyExtRef.current, `Validation of Table Body instance`, extLine(new Error()));
      if (
        internalProfs.length > 0 &&
        externalProfs.length > 0 &&
        tbodyExtRef.current.querySelector("tr") &&
        tbodyIntRef.current.querySelector("tr")
      )
        return;
      setTimeout(() => {
        if (internalProfs.length > 0 || externalProfs.length > 0) return;
        handleFetch("profs", "_table", true)
          .then(res => {
            if (Array.isArray(res)) {
              let err = "";
              for (const p of res) {
                if ((p as ProfInfo).external) {
                  if (!tbodyExtRef.current) {
                    if (!/extern/gi.test(err))
                      navigatorVars.pt
                        ? (err += `Houve algum erro validando a Tabela de Profissionais Externos`)
                        : (err += "There was some error validating the Table of External Professionals");
                    continue;
                  }
                  !externalProfs.includes(p as ProfInfo) && externalProfs.push(p as ProfInfo);
                } else {
                  if (!tbodyIntRef.current) {
                    if (!/intern/gi.test(err))
                      navigatorVars.pt
                        ? (err += `Houve algum validando a Tabela de Profissionais Internos`)
                        : (err += `There was some error validating the Table for Internal Professionals`);
                    continue;
                  }
                  internalProfs.includes(p as ProfInfo) && internalProfs.push(p as ProfInfo);
                }
              }
            } else
              throw new Error(
                navigatorVars.pt ? `A lista de dados não pôde ser criada` : "The data list could not be created",
              );
          })
          .catch(err => {
            if (tabToasted.current) return;
            toast.error(
              `${navigatorVars.pt ? `Erro: código` : `Error: code`} ${codifyError(err)}` ||
                (navigatorVars.pt ? `Erro desconhecido` : `Unknown error`),
            );
            tabToasted.current = true;
            setTimeout(() => (tabToasted.current = false), 3000);
          })
          .finally(() => {
            setTimeout(
              () => syncAriaStates([...(mainRef.current?.querySelectorAll("*") ?? []), mainRef.current!]),
              1200,
            );
            !loaded && setLoad(true);
          });
      }, 300);
    } catch (e) {
      console.error(`Error executing useEffect for Table Body Reference:\n${(e as Error).message}`);
    }
  }, [props.dispatch, props.mainDlgRef, props.state, userClass, tbodyExtRef, tbodyIntRef]);
  useEffect(() => {
    if (!loaded) return;
    [
      { grp: externalProfs, ref: tbodyExtRef.current },
      { grp: internalProfs, ref: tbodyIntRef.current },
    ].forEach(({ grp, ref }) => {
      try {
        if (!ref) return;
        const filtered = grp.filter(p => validator(p));
        console.log(filtered);
        if (filtered.length > 0)
          toast.success(`Lista de dados carregada com sucesso`, {
            duration: 1000,
            iconTheme: { primary: "#07919e", secondary: "#FFFAEE" },
          });
        else if (!tabToasted.current) {
          toast.error(navigatorVars.pt ? `A lista de dados não foi preenchida` : "The data list was not filled");
          tabToasted.current = true;
          setTimeout(() => (tabToasted.current = false), 3000);
        }
        const extArr: ProfInfo[] = [],
          intArr: ProfInfo[] = [];
        filtered.forEach(p => {
          p.external ? extArr.push(p) : intArr.push(p);
        });
        setExtData(prev => {
          prev.splice(0, prev.length);
          return filtered.length === 0
            ? [<GenericErrorComponent message='❌ Não foi possível carregar os dados!' />]
            : extArr.map((p, i) => (
                <ProfRow nRow={i + 2} prof={p} tabRef={tabProfIntRef} key={`prof_ext_row__${i + 2}`} inDlg={true} />
              ));
        });
        setIntData(prev => {
          prev.splice(0, prev.length);
          return filtered.length === 0
            ? [<GenericErrorComponent message='❌ Não foi possível carregar os dados!' />]
            : extArr.map((p, i) => (
                <ProfRow nRow={i + 2} prof={p} tabRef={tabProfIntRef} key={`prof_int_row__${i + 2}`} inDlg={true} />
              ));
        });
        setTimeout(() => syncAriaStates([...(ref.querySelectorAll("*") ?? []), ref]), 500);
      } catch (e) {
        return;
      }
    });
  }, [loaded, validator, tbodyExtRef, tbodyIntRef]);
  useEffect(() => {
    if (!loaded) return;
    [tbodyExtRef.current, tbodyIntRef.current].forEach(ref => {
      if (!ref) return;
      initLoadedTab(ref, userClass as privilege);
      props.dispatch &&
        ref.querySelectorAll(".btnAloc").forEach((btn, i) => {
          try {
            addListenerAlocation(
              btn,
              mainRef.current,
              props.mainDlgRef.current,
              "Prof",
              props.state,
              props.dispatch,
              userClass,
            );
          } catch (e) {
            console.error(
              `Error executing iteration ${i} for adding alocation listener to external professionals table:\n${
                (e as Error).message
              }`,
            );
          }
        });
      const typeConsSel = props.mainDlgRef.current?.querySelector("#typeConsSel");
      if (!(typeConsSel instanceof HTMLSelectElement))
        throw inputNotFound(
          typeConsSel,
          `<select> for getting type of appointment for ${tabProfIntRef.current?.id || "UNIDENTIFIED"}`,
          extLine(new Error()),
        );
      const selectedOp = typeConsSel.options[typeConsSel.selectedIndex];
      if (!(selectedOp instanceof HTMLOptionElement)) return;
      const relOptgrp = selectedOp.closest("optgroup");
      if (relOptgrp instanceof HTMLOptGroupElement && relOptgrp.label !== "")
        filterTabMembers(tabProfIntRef.current, relOptgrp.label.toLowerCase().trim());
    });
  }, [extData, intData]);
  return (
    <>
      {props.state && props.btnProf instanceof HTMLButtonElement && (
        <dialog
          className='modal-content-stk2'
          id='avProfListDlg'
          ref={mainRef}
          onClick={ev =>
            isClickOutside(ev, ev.currentTarget).some(coord => coord === true) && props.dispatch(!props.state)
          }>
          <ErrorBoundary
            FallbackComponent={() => (
              <ErrorFallbackDlg
                renderError={new Error(`Erro carregando a janela modal!`)}
                onClick={() => props.dispatch(props.state)}
              />
            )}>
            <section className='flexRNoWBetCt widFull' id='headProfList'>
              <h2 className='mg-1b noInvert'>
                <strong>Profissionais Cadastrados</strong>
              </h2>
              <button className='btn btn-close forceInvert' onClick={() => props.dispatch(!props.state)}></button>
            </section>
            <section className='form-padded' id='sectProfsTabs' ref={secttabProfIntRef}>
              <table
                className='table table-striped table-responsive table-hover tabProfs'
                id='avProfsIntTab'
                ref={tabProfIntRef}>
                <caption className='caption-t'>
                  <hgroup className='noInvert'>
                    <h3 className='noInvert'>
                      <strong>Membros Internos</strong>
                    </h3>
                    <strong>
                      <small role='textbox' className='noInvert'>
                        <em className='noInvert'>
                          Lista Recuperada da Ficha de Profissionais registrados. Acesse
                          <samp>
                            <Link
                              to={`${location.origin}/panel?panel-regist-prof`}
                              id='registProfLink'
                              style={{ display: "inline" }}>
                              Cadastrar Membro Profissional
                            </Link>
                          </samp>
                          para cadastrar
                        </em>
                      </small>
                    </strong>
                  </hgroup>
                </caption>
                <colgroup>
                  {Array.from({ length: 7 }, (_, i) => (
                    <col key={`col_av_prof_int__${i}`} data-row={1} data-col={i + 1}></col>
                  ))}
                  {userClass === "coordenador" && <col data-row={1} data-col={8}></col>}
                </colgroup>
                <thead className='thead-dark'>
                  <tr id='avProfsInt-row1' data-row='1'>
                    {userClass === "coordenador" && (
                      <th scope='col' data-row='1' data-col='1'>
                        Identificador
                      </th>
                    )}
                    {[
                      "Nome",
                      "E-mail",
                      "Telefone",
                      "Área de Atuação",
                      "Dia de Trabalho",
                      "Período de Participação",
                      "",
                    ].map((l, i) => (
                      <th
                        key={`th_av_prof_int__${i}`}
                        scope='col'
                        data-row={1}
                        data-col={userClass === "coordenador" ? i + 2 : i + 1}>
                        {l}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody id='profsIntTbody' ref={tbodyIntRef}>
                  {intData}
                </tbody>
              </table>
              <table
                className='table table-striped table-responsive table-hover tabProfs'
                id='avProfsExtTab'
                ref={tabProfExtRef}>
                <caption className='caption-t'>
                  <hgroup className='noInvert'>
                    <h3 className='noInvert'>
                      <strong>Membros Externos</strong>
                    </h3>
                    <strong>
                      <small role='textbox' className='noInvert'>
                        <em className='noInvert'>
                          Lista Recuperada da Ficha de Profissionais registrados. Acesse
                          <samp>
                            <Link
                              to={`${location.origin}/panel?panel-regist-prof`}
                              id='registProfLink'
                              style={{ display: "inline" }}>
                              Cadastrar Membro Profissional
                            </Link>
                          </samp>
                          para cadastrar
                        </em>
                      </small>
                    </strong>
                  </hgroup>
                </caption>
                <colgroup>
                  {Array.from({ length: 7 }, (_, i) => (
                    <col key={`col_av_prof_ext__${i}`} data-row={1} data-col={i + 1}></col>
                  ))}
                  {userClass === "coordenador" && <col data-row={1} data-col={8}></col>}
                </colgroup>
                <thead className='thead-dark'>
                  <tr id='avProfsExt-row1' data-row={1}>
                    {userClass === "coordenador" && (
                      <th scope='col' data-row={1} data-col={1}>
                        Identificador
                      </th>
                    )}
                    {[
                      "Nome",
                      "E-mail",
                      "Telefone",
                      "Área de Atuação",
                      "Dia de Trabalho",
                      "Período de Participação",
                      "",
                    ].map((l, i) => (
                      <th
                        key={`th_av_prof_ext__${i}`}
                        scope='col'
                        data-row={1}
                        data-col={userClass === "coordenador" ? i + 2 : i + 1}>
                        {l}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody id='profsExtTbody' ref={tbodyExtRef}>
                  {extData}
                </tbody>
              </table>
            </section>
          </ErrorBoundary>
        </dialog>
      )}
    </>
  );
}
