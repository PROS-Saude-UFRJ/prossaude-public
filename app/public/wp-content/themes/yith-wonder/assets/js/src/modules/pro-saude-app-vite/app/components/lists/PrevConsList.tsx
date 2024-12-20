"use client";
import { ErrorBoundary } from "react-error-boundary";
import { HistoricDlgProps } from "../../src/lib/global/declarations/interfacesCons";
import { isClickOutside } from "../../src/lib/global/gStyleScript";
import { nlTab } from "../../src/lib/global/declarations/types";
import { useRef } from "react";
import ErrorFallbackDlg from "../error/ErrorFallbackDlg";
import GenericErrorComponent from "../error/GenericErrorComponent";
import PrevConsRow from "./PrevConsRow";
import { Link } from "react-router-dom";
import useDialog from "../../src/lib/hooks/useDialog";
export default function PrevConsList({
  dispatch,
  state = true,
  name = "Anônimo",
  historic = [
    {
      type: "avaliacao",
      day: "0000-00-00",
      prof: "Anônimo",
      stud: "Anônimo",
      notes: "",
    },
  ],
}: HistoricDlgProps): JSX.Element {
  const { mainRef } = useDialog({
      state,
      dispatch,
      param: `${location.search}&prev-cons=open#${btoa(
        String.fromCodePoint(...new TextEncoder().encode(name.toLowerCase().replaceAll(" ", "-"))),
      )}`,
    }),
    prevConsTabRef = useRef<nlTab>(null),
    togglePrevConsDisplay = (state: boolean = true): void => dispatch(!state);
  return (
    <ErrorBoundary FallbackComponent={() => <GenericErrorComponent message='Erro carregando modal' />}>
      <dialog
        className='modal-content-stk2'
        ref={mainRef}
        id={`prev-cons-${name.toLowerCase().replaceAll(" ", "-")}`}
        onClick={ev => {
          if (isClickOutside(ev, ev.currentTarget).some(coord => coord === true)) {
            ev.currentTarget.close();
            dispatch(!state);
          }
        }}>
        <ErrorBoundary
          FallbackComponent={() => (
            <ErrorFallbackDlg
              renderError={new Error(`Erro carregando a janela modal!`)}
              onClick={() => togglePrevConsDisplay(state)}
            />
          )}>
          <section className='flexRNoWBetCt widFull' id='headPrevConsList'>
            <h2 className='mg-1b'>
              <strong>Consultas Anteriores</strong>
            </h2>
            <button className='btn btn-close forceInvert' onClick={() => togglePrevConsDisplay(state)}></button>
          </section>
          <section className='form-padded' id='sectPacsTab'>
            <table
              className='table table-striped table-responsive table-hover tabPacs'
              id='avPacsTab'
              ref={prevConsTabRef}>
              <caption className='caption-t'>
                <strong>
                  <small role='textbox'>
                    <em className='noInvert'>
                      Lista Recuperada da Ficha de Pacientes registrados. Acesse
                      <samp>
                        <Link to={`${location.origin}/ag`} id='agLink' style={{ display: "inline" }}>
                          &nbsp;Anamnese Geral&nbsp;
                        </Link>
                      </samp>
                      para cadastrar
                    </em>
                  </small>
                </strong>
              </caption>
              <colgroup>
                {Array.from({ length: 5 }, (_, i) => (
                  <col key={`pac_col__${i}`} data-col={i + 1}></col>
                ))}
              </colgroup>
              <thead className='thead-dark'>
                <tr id='avPacs-row1' data-row={1}>
                  {[
                    "Nome",
                    "Data",
                    "Tipo de Consulta",
                    "Profissional Responsável",
                    "Estudante Alocado",
                    "Anotações",
                  ].map((l, i) => (
                    <th key={`pac_th__${i}`} scope='col' data-row={1} data-col={i + 1}>
                      {l}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {historic.map((iHist, i) => (
                  <PrevConsRow name={name} nRow={i + 2} historic={iHist} key={`i-hist__${i + 2}`} />
                ))}
              </tbody>
            </table>
          </section>
        </ErrorBoundary>
      </dialog>
    </ErrorBoundary>
  );
}
